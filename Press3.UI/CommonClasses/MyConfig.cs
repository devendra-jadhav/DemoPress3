using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;

namespace Press3.UI.CommonClasses
{
    public class MyConfig
    {
        private static string myConnString;
        public static string MyConnectionString
        {
            get
            {
                if (myConnString == null)
                {
                    myConnString = ConfigurationManager.ConnectionStrings["Press3"].ConnectionString;
                }
                return myConnString;
            }
        }
     
        public static string IvrStudioFileUploadPath
        {
            get
            {
                return ConfigurationManager.AppSettings["IvrStudioFileUploadPath"].ToString();
            }
        }
        public static string IvrStudioShowClipUploadPath
        {
            get
            {
                return ConfigurationManager.AppSettings["IvrStudioShowClipUploadPath"].ToString();
            }
        }
        public static string ActionUrl
        {
            get
            {
                return ConfigurationManager.AppSettings["ActionUrl"].ToString();
            }
        }
        public static string IsAutoSubject
        {
            get
            {
                return ConfigurationManager.AppSettings["IsAutoSubject"].ToString();
            }
        }
        public static string IsAlsagr
        {
            get
            {
                return ConfigurationManager.AppSettings["IsAlsagr"].ToString();
            }
        }
        public static string OutboundCallBackUrl
        {
            get
            {
                return ConfigurationManager.AppSettings["OutboundCallBackUrl"].ToString();
            }
        }
        public static string IsAutoRefresh 
        {
            get 
            {
                return ConfigurationManager.AppSettings["IsAutoRefresh"].ToString();
            }
        }
    }
}                                        