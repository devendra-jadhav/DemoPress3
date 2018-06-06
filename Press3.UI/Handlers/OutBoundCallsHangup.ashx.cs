using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using Newtonsoft.Json.Linq;
using Press3.UI.CommonClasses;
using Press3.UI.AppCode;
using Press3.Utilities;



namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for OutBoundCallsHangup
    /// </summary>
    public class OutBoundCallsHangup : IHttpHandler
    {
        private string dialplanxml = string.Empty;
        public JObject responseJobj=new JObject();
        Press3.BusinessRulesLayer.CurlDialPlan updateOutbound = new Press3.BusinessRulesLayer.CurlDialPlan();
       
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                Press3.UserDefinedClasses.HttpParameters freeswitchParameters = new Press3.UserDefinedClasses.HttpParameters();
                freeswitchParameters.ParseParameters(context);
               // Press3.UserDefinedClasses.ReadRestParameters restParameters = new Press3.UserDefinedClasses.ReadRestParameters(context);
                if (freeswitchParameters.Event.Equals("hangup"))
                {
                    string response = updateOutbound.UpdateOutboundCalls(freeswitchParameters);   
                    context.Response.Write(response);
                }

                else if (freeswitchParameters.Event.Equals("dial"))
                {
                    responseJobj = updateOutbound.UpdateDial(freeswitchParameters);
                    if (responseJobj.SelectToken("Success").ToString() == "True")
                    {
                        dialplanxml = "<Response><Hangup reason='Dial Details Updated Successfully'/></Response>";
                    }
                    else
                    {
                        dialplanxml = "<Response><Hangup reason='Dail Details Updation Failed'/></Response>";

                    }
                }
            }
            catch(Exception e){
                Logger.Error("Exception while processing request in outboundcallshangup:"+e.ToString());
            }
            if (String.IsNullOrEmpty(dialplanxml))
            {
                dialplanxml = "<Response><Hangup reason='No Xml Action Found'/></Response>";
            }
            else
            {
                SendXmlResponse(context, dialplanxml, true);
            }
            
        }

        public void SendXmlResponse(HttpContext context, String xmlresponse, Boolean isXml)
        {
            try
            {
                if (isXml)
                {
                    context.Response.ContentType = "text/xml";
                }
                else
                {
                    context.Response.ContentType = "application/json";
                }
                context.Response.Write(xmlresponse);

            }
            catch (Exception e)
            {
                Logger.Error("Exception while sending dialplan Xml to Context:" + e.ToString());

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