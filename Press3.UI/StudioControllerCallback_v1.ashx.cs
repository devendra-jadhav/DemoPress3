using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Press3.BusinessRulesLayer;
using Press3.Utilities;
using Press3.UI.CommonClasses;

namespace Press3.UI
{
    /// <summary>
    /// Summary description for StudioControllerCallback_v1
    /// </summary>
    public class StudioControllerCallback_v1 : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            StudioControllerV1 studioController = new StudioControllerV1();
            context.Response.ContentType = "text/plain";
            context.Response.Write(studioController.GetStudioXml(context, MyConfig.MyConnectionString));
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