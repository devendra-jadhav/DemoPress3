using Press3.BusinessRulesLayer;
using Press3.UI.CommonClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for DialCallBackAction
    /// </summary>
    public class DialCallBackAction : IHttpHandler
    {
        StudioController studioController = new StudioController();
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/xml";
            context.Response.Write(studioController.UpdateAgentAnswerState(context, MyConfig.MyConnectionString));
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