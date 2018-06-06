using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for SaveImage
    /// </summary>
    public class SaveImage : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string pic = context.Request["pic"];
            string folderPath = "";
            folderPath = HttpContext.Current.Server.MapPath("~/Images/TempImages/");
            // floderName = "ScriptFileUpload";
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            folderPath = "";
            folderPath = HttpContext.Current.Server.MapPath("~/Images/ProfileImages/");
            // floderName = "ScriptFileUpload";
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }


            string img = HttpContext.Current.Server.MapPath("/Images/TempImages/");
            HttpPostedFile hpf = default(HttpPostedFile);
            hpf = context.Request.Files[0] as HttpPostedFile;
            string fileName = string.Empty;
            if (context.Request.Browser.Browser.ToUpper() == "IE")
            {
                string[] files = hpf.FileName.Split(new char[] { '\\' });
                fileName = files[files.Length - 1];
            }
            else
            {
                fileName = hpf.FileName;
            }
            if (pic == "small")
            {
                fileName = DateTime.Now.ToString("ddMMyyyyHHmmssfffff") + "_thumb" + fileName.Substring(fileName.LastIndexOf("."));
            }
            else
            {
                fileName = DateTime.Now.ToString("ddMMyyyyHHmmssfffff") + "_large" + fileName.Substring(fileName.LastIndexOf("."));
            }
            string savedPath = img + fileName;
            hpf.SaveAs(savedPath);

            context.Response.Write(fileName);
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