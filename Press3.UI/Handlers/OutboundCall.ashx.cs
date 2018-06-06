using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Press3.UI.CommonClasses;
using Newtonsoft.Json.Linq;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for OutboundCall
    /// </summary>
    public class OutboundCall : IHttpHandler
    {
        public bool isCustomer = false;
        public int agentId = 0;
        public void ProcessRequest(HttpContext context)
        {
            if (!string.IsNullOrEmpty(context.Request.QueryString["IsCustomer"]))
            {
                isCustomer = Convert.ToBoolean(context.Request.QueryString["IsCustomer"]);
            }
            if (!string.IsNullOrEmpty(context.Request.QueryString["AgentId"]))
            {
                agentId = Convert.ToInt32(context.Request.QueryString["AgentId"]);
            }
            string date = System.DateTime.Now.ToString("yyyyMMdd");
            if(!System.IO.Directory.Exists(context.Server.MapPath("~/LocalCallBacksDebug/" + date)))
            {
                System.IO.Directory.CreateDirectory(context.Server.MapPath("~/LocalCallBacksDebug/" + date));
            }
            try
            {
                context.Request.SaveAs(context.Server.MapPath("~/LocalCallBacksDebug/" + date + "/" + DateTime.Now.ToString("HHmmssfff") + ".txt"), true);
            }
            catch(Exception e)
            {
                Utilities.Logger.Error(string.Format("Exception while saving callback request into a file. {0}", e.ToString()));
            }
            Press3.BusinessRulesLayer.OutboundCall outboundobj = new Press3.BusinessRulesLayer.OutboundCall();
            context.Response.ContentType = "text/plain";
            JObject resObj = new JObject();
            resObj = outboundobj.UpdateCallDetails(context, MyConfig.MyConnectionString, MyConfig.OutboundCallBackUrl, isCustomer, agentId, MyConfig.IvrStudioShowClipUploadPath);
            if (string.IsNullOrEmpty(Convert.ToString(resObj.SelectToken("ResponseXML"))) == false)
            {
                context.Response.Write(resObj.SelectToken("ResponseXML").ToString());
            }else{
                context.Response.Write(resObj);
            }
            
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