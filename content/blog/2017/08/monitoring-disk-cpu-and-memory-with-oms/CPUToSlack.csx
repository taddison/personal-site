#r "Newtonsoft.Json"

using System;
using System.Net;
using System.Collections;
using Newtonsoft.Json;
using System.Text;

public static async Task<object> Run(HttpRequestMessage req, TraceWriter log)
{
    var slackUri = "https://requestb.in/1hoo74a1";
    var slackChannel = "#oms-alerts";
    var slackUsername = "OMS";

    var data = await req.Content.ReadAsAsync<OMSPayload>();

    var warningThreshold = data?.WarningThreshold ?? 75;
    var criticalThreshold = data?.CriticalThreshold ?? 90;

    var aggregatedResults = data.SearchResults.Tables[0].Rows.GroupBy(r => r[1].ToString())
                            .Select(g => new {  Computer = g.Key
                                                ,Average = g.Average(r => Double.Parse(r[2].ToString()))
                                                ,Warning = g.Count(r =>  Double.Parse(r[2].ToString()) >= warningThreshold)
                                                ,Critical = g.Count(r =>  Double.Parse(r[2].ToString()) >= criticalThreshold) });

    var message = string.Empty;
    var critical = false;
    
    foreach(var result in aggregatedResults)
    {
        message +=  $" - {result.Computer}:[{result.Warning} >{warningThreshold}% | {result.Critical} >{criticalThreshold}% | {(result.Average/100):P0} avg]";
        
        if(result.Critical > 0)
        {
            critical = true;
        }
    }

    message = $"Infra - CPU {(critical ? "Critical" : "Warning")}" + message;

    using(var client = new HttpClient())
    {
        var slackPayload = new SlackMessage() { text = message, channel = slackChannel, username = slackUsername, link_names = true };
        var hook = new StringContent(JsonConvert.SerializeObject(slackPayload), Encoding.UTF8, "application/json");
        var resp = await client.PostAsync(slackUri, hook);
    }

    return req.CreateResponse(HttpStatusCode.OK);
}

public class SlackMessage
{
    public string text { get; set; }
    public string channel { get; set; }
    public string username { get; set; }
    public bool link_names { get; set ; }
}

public class Column
{
    public string ColumnName { get; set; }
    public string DataType { get; set; }
    public string ColumnType { get; set; }
}

public class Table
{
    public string TableName { get; set; }
    public List<Column> Columns { get; set; }
    public List<List<object>> Rows { get; set; }
}

public class SearchResults
{
    public List<Table> Tables { get; set; }
}

public class OMSPayload
{
    public int WarningThreshold { get; set; }
    public int CriticalThreshold { get; set; }
    public SearchResults SearchResults { get; set; }
}