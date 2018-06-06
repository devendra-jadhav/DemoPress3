using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Press3.Utilities;
using Press3.UserDefinedClasses;
using Press3.BusinessRulesLayer;
using Press3.UI.CommonClasses;
namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for ClientCallerIdMetaData
    /// </summary>
    public class ClientCallerIdMetaData : IHttpHandler
    {
        StudioController studioController = new StudioController();
        public void ProcessRequest(HttpContext context)
        {
            
            //JObject responseMetaData = new JObject();
            //responseMetaData.Add("Success", true);
            //responseMetaData.Add("AnswerUrl", "http://local.press3.com/StudioControllerCallback.ashx");
            //responseMetaData.Add("HangupUrl", "http://local.press3.com/StudioControllerCallback.ashx");
            //responseMetaData.Add("ActionMethod","GET");
            //responseMetaData.Add("NotifyCallFlow","false");
            //responseMetaData.Add("SequenceNumber",0);            
            //responseMetaData.Add("Message", "OK");
            
            context.Response.ContentType = "application/json";
            context.Response.Write(studioController.BsGetCallerIdDetails(context, MyConfig.MyConnectionString));

        }



        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}