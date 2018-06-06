using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using System.Web;
using System.Net;
using System.IO;
using Press3.Utilities;

namespace Press3.BusinessRulesLayer
{
    public class Gateways
    {
        public JObject HangupApi(string UUID,string originationUrl)
        {
            JObject hanupresObj = null;
            WebRequest webReq = null;
            StreamReader sReader = null;
            StreamWriter sWriter = null;
            string postingData = "";
            string httpAPIResponseString = "";
            JObject responseObj = new JObject();
            try
            {

                if (!string.IsNullOrEmpty(UUID.Trim()))
                {
                    try
                    {
                        webReq = WebRequest.Create(originationUrl + "HangupCall/");
                        webReq.Method = "POST";
                        webReq.Timeout = 10000;
                        //_Req.KeepAlive = false;
                        webReq.ContentType = "application/x-www-form-urlencoded";
                        postingData = "RequestUUID=" + UUID;
                        sWriter = new StreamWriter(webReq.GetRequestStream());
                        sWriter.Write(postingData);
                        sWriter.Flush();
                        sWriter.Close();
                        sReader = new StreamReader(webReq.GetResponse().GetResponseStream());
                        httpAPIResponseString = sReader.ReadToEnd();
                        Logger.Info("Hangup Response : " + httpAPIResponseString.ToString());
                        sReader.Close();
                    }
                    catch (Exception ex)
                    {
                        Press3.Utilities.Logger.Error("Exception In HangUp " + ex.ToString());
                    }
                }
                hanupresObj = new JObject(new JProperty("Success", "True"), new JProperty("Message", "Success"));
            }
            catch (Exception ex)
            {
                Press3.Utilities.Logger.Error("Exception In HangUp " + ex.ToString());
                hanupresObj = new JObject(new JProperty("Success", "False"),
                    new JProperty("Message", "Cannot hangup at this moment"));
            }
            return hanupresObj;
        }

        public JObject RestApiRequest(string postData, string originationUrl, string method = "GET")
        {
            JObject hanupresObj = null;
            WebRequest webReq = null;
            StreamReader sReader = null;
            StreamWriter sWriter = null;
            string httpAPIResponseString = "";
            JObject responseObj = new JObject();
            try
            {

                if (!string.IsNullOrEmpty(postData.Trim()))
                {
                    Logger.Debug("Make Rest Request: HttpUrl:"+originationUrl+",Postdata:"+postData);
                    webReq = WebRequest.Create(originationUrl);
                    webReq.Method = method;
                    webReq.Timeout = 10000;
                    webReq.ContentType = "application/x-www-form-urlencoded";
                    sWriter = new StreamWriter(webReq.GetRequestStream());
                    sWriter.Write(postData);
                    sWriter.Flush();
                    sWriter.Close();
                    sReader = new StreamReader(webReq.GetResponse().GetResponseStream());
                    httpAPIResponseString = sReader.ReadToEnd();
                    responseObj = JObject.Parse(httpAPIResponseString);
                    Logger.Debug("Http Rest Api Response : " + httpAPIResponseString.ToString());
                    sReader.Close();
                }
            }
            catch (Exception ex)
            {
                Press3.Utilities.Logger.Error("Exception In Making Http Request Gateways  " + ex.ToString());
                responseObj = new JObject(new JProperty("Success", "False"),
                    new JProperty("Message", "Http Request Failed while calling EndConferene"));
            }
            return responseObj;
        }
    }
}
