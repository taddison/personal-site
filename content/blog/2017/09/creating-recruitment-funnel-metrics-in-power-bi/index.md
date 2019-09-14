---
layout: post
title: Creating recruitment funnel metrics in Power BI
share-img: http://tjaddison.com/assets/2017/2017-09-10/FunnelRight.png
tags: [PowerBI, Recruiting]
---
Creating a funnel chart in Power BI is extremely simple - drop your measure and group by column onto the canvas and format as a funnel chart.  The tricky part is making sure your data is modelled correctly to give you the answers you need.  If we assume that a simple 4-stage recruitment process (New Application - Phone Screen - Face to Face - Hire) has data captured in the following format:

![Sample application data](/assets/2017/2017-09-10/SampleData.png)

When we create a funnel chart in Power BI we see the following:

![Not the funnel we expected](/assets/2017/2017-09-10/FunnelWrong.png)

That is technically correct (there are 3 applications in the New stage), but it isn't what we wanted (10 people applied and we hired 1 - which is not a 25% hire rate).  While we could change our data (typically modifying the query to include multiple columns - one for each stage), this one is fairly easy to solve with a few DAX calculations to return the inclusive number of applications by stage.

<!--more-->

The core measure we build returns the number of applications which have got to *at least* that stage.  We do this by removing the filter context from both Stage and StageOrder (we typically visualise by Stage, but we rely on StageOrder for ranking stages), and then using the MAX function to pull the value of StageOrder from the filter context.  In our case, the filter context will be the current group expression on the funnel.

```dax
Applications = 
COUNTROWS( Applications )

Inclusive Applications =
CALCULATE (
    [Applications],
    FILTER (
        ALL ( Applications[Stage], Applications[StageOrder] ),
        Applications[StageOrder] >= MAX ( Applications[StageOrder] )
    )
)
```

Using this measure instead gives us the funnel we expected:

![Funnel with inclusive applications](/assets/2017/2017-09-10/FunnelRight.png)

We can also define some additional DAX measures to report directly on the conversion rate between each step of the funnel.  In the example below I've only defined a subset of the measures - typically you'd define these for all stages and conversion rates you cared about.

```dax
Hire = 
CALCULATE ( 
    [Inclusive Applications], Applications[Stage] = "Hire" 
)

Hire % All = 
DIVIDE ( [Hire], [Applications], 0 ) 

Face to Face = 
CALCULATE ( 
    [Inclusive Applications], Applications[Stage] = "Face to Face" 
)

Hire % F2F = 
DIVIDE ( [Hire], [Face to Face], 0 )
```

These can then be used when you want to compare those metrics between roles, locations, over time, or anything else you have in your model.

If you're currently recruiting and you don't know what your funnel looks like I encourage you to read [how to recruit](http://randsinrepose.com/archives/how-to-recruit/) and then take another look at your funnel metrics (building them if needed).

You can download an example Power BI desktop file with the sample data and formulae [here](/assets/2017/2017-09-10/FunnelSample.pbix).