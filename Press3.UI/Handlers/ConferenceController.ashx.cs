using Press3.BusinessRulesLayer;
using Press3.UI.CommonClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for ConferenceController
    /// </summary>
    public class ConferenceController : IHttpHandler
    {
        Press3.BusinessRulesLayer.Conference conference = new Press3.BusinessRulesLayer.Conference(MyConfig.MyConnectionString);

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write(conference.UpdateConference(context, MyConfig.MyConnectionString));
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