using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace Press3.UI
{
    /// <summary>
    /// Summary description for Version
    /// </summary>
    public class Version : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string websitePath = context.Server.MapPath("~"); //System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
            string dllPath = websitePath + "\\bin\\Press3.UI.dll";
            FileVersionInfo fileVersion = FileVersionInfo.GetVersionInfo(dllPath);
            context.Response.Write(fileVersion.FileVersion);
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