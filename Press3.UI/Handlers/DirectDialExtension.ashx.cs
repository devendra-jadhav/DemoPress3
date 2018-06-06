using Press3.UI.CommonClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BRL = Press3.BusinessRulesLayer;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for DirectDialExtension
    /// </summary>
    public class DirectDialExtension : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            BRL.DirectDialExtension dialExtObj = new BRL.DirectDialExtension();
            context.Response.ContentType = "text/plain";
            context.Response.Write(dialExtObj.GetXml(context, MyConfig.MyConnectionString));
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