using Press3.BusinessRulesLayer;
using Press3.UI.CommonClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for CallBackRequestAction
    /// </summary>
    public class CallBackRequestAction : IHttpHandler
    {
        StudioControllerV1 studioControllerV1 = new StudioControllerV1();
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            context.Response.Write(studioControllerV1.GetStudioXml(context, MyConfig.MyConnectionString, false,true));
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