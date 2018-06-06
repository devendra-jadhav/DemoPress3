using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using System.Xml;
using System;
using System.Web;
using Press3.BusinessRulesLayer;
using Press3.UI.CommonClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using UDC = Press3.UserDefinedClasses;
using Press3.BusinessRulesLayer;
using Press3.UI.CommonClasses;
using Press3.Utilities;
using Press3.BusinessRulesLayer;
using Press3.UserDefinedClasses;


namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for CurlDialPlan
    /// </summary>
    public class CurlDialPlan : IHttpHandler
    {
        public Gateways gateway = new Gateways();
        private string dialplanxml = string.Empty;
        public JObject responseJobj = new JObject();

        public void ProcessRequest(HttpContext context)
        {
            
            try
            {

                    string isSave     = AppConfig.GetApplicationKey("SaveFreeSwitchRequest");

                    if(isSave=="1"){
                        if (!Directory.Exists(HttpContext.Current.Server.MapPath("~/FreeSwitchRequest/")))
                        {
                            Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/FreeSwitchRequest/"));
                            Logger.Info("Freeswitch requsts directory created in dial plan section.");
                        }


                    string path = HttpContext.Current.Server.MapPath("~/FreeSwitchRequest/") + System.DateTime.Now.ToString("yyyyMMddHHmmss");
                    HttpContext.Current.Request.SaveAs(path + ".txt", true);
                    Logger.Debug("Freeswitch dialplan  Request is saved in " + path);
                    }
                    
                Press3.BusinessRulesLayer.CurlDialPlan DialPlanObject = new Press3.BusinessRulesLayer.CurlDialPlan(context);
                UDC.DialPlan dialPlanVariables = new UDC.DialPlan();

                if(DialPlanObject.CallerId == 1)
                {
                    dialPlanVariables.Mode = 3;
                    dialPlanVariables.DestinationNumber = DialPlanObject.DestinationNumber;
                    dialPlanVariables.ExtensionName = "Extension_All_inbound";
                    dialPlanVariables.IsInBound = true;
                    dialplanxml = DialPlanObject.GetDialplanXml(dialPlanVariables);
                    //dialplanxml=  DialPlanObject.SocketXml("Extension_All_inbound",true);
                    Logger.Debug("Incoming call to Press3 Studio so socket Xml:" + dialplanxml);
                }
                else if (!DialPlanObject.IsAgentDial && !String.IsNullOrEmpty(DialPlanObject.TransferFrom) && !String.IsNullOrEmpty(DialPlanObject.TransferTo))
                {

                    dialPlanVariables.Mode = 5;
                    dialPlanVariables.ExtensionName = "Extension_Agent_Transfer";
                    dialPlanVariables.DestinationNumber = DialPlanObject.DestinationNumber;
                    dialPlanVariables.TransferFromNumber = DialPlanObject.TransferFrom;
                    dialPlanVariables.TransferToNumber = DialPlanObject.TransferTo;
                    dialPlanVariables.UserContext = DialPlanObject.UserContext;
                    dialPlanVariables.IsInBound = false;
                    dialplanxml = DialPlanObject.GetDialplanXml(dialPlanVariables);
                    Logger.Debug("Reached to Transfer functionality" + dialplanxml);
                }
                
                else if (!DialPlanObject.IsAgentDial)
                {
                    dialPlanVariables.Mode = 3;
                    dialPlanVariables.ExtensionName = "Extension_Agent_dial";
                    dialPlanVariables.DestinationNumber = DialPlanObject.DestinationNumber;
                    dialPlanVariables.IsInBound = false;
                    dialplanxml = DialPlanObject.GetDialplanXml(dialPlanVariables);

                    //dialplanxml = DialPlanObject.SocketXml("Extension_Agent_dial",false);
                    Logger.Debug("It is not press3 studio call so that we are navigating to socket with agent dial page:" + dialplanxml);

                }
               

                else if(DialPlanObject.IsAgentDial && DialPlanObject.CurlCallEvent.Equals("newcall"))
                {
                    dialplanxml = DialPlanObject.ResponseXml();
                    Logger.Debug("Reached to AgentDial bridging xml:"+dialplanxml);
                }
                    //else if(DialPlanObject.IsAgentDial && DialPlanObject.CurlCallEvent.Equals("dial")){    
                //    // we are updating event dial parameters all event params willpost to this url
                //   responseJobj= DialPlanObject.UpdateDial();
                //   if (responseJobj.SelectToken("Success").ToString() == "True")
                //   {

                //       dialplanxml = "<Response><Hangup reason='Dial Details Updated Successfully'/></Response>";
                //     //  context.Response.Write("<Response>Dial Details Updated Successfully</Response>");                       
                //   }
                //   else
                //   {
                //       dialplanxml = "<Response><Hangup reason='Dail Details Updation Failed'/></Response>";
                //     //  context.Response.Write("<Response>Dail Details Updation Failed</Response>");
                      
                //   }                     
                //}
                else
               {
                    dialPlanVariables.Mode = 4;
                    dialPlanVariables.ExtensionName = "Extension_All_inbound_xml";
                    dialPlanVariables.DestinationNumber = DialPlanObject.DestinationNumber;
                    dialPlanVariables.IsInBound = false;
                    dialplanxml = DialPlanObject.GetDialplanXml(dialPlanVariables);
                    Logger.Info("Send default Socket Xml for if serveris in smscountry production.");
                }

                if (String.IsNullOrEmpty(dialplanxml))
                {
                    dialplanxml = "<Response><Hangup reason='No Xml Action Found'/></Response>";
                }
                //else if (DialPlanObject.IsAgentDial && DialPlanObject.CurlCallEvent.Equals("newcall") && !String.IsNullOrEmpty(DialPlanObject.TransferFrom) && !String.IsNullOrEmpty(DialPlanObject.TransferTo))
                //{
                //    SendXmlResponse(context, dialplanxml, true);
                //}
                else if (DialPlanObject.CurlCallEvent != null && DialPlanObject.CurlCallEvent.Equals("newcall") && DialPlanObject.IsAgentDial)
                {
                    SendXmlResponse(context, dialplanxml,false);
                }
                else
                {
                    SendXmlResponse(context, dialplanxml, true);
                }

                Logger.Info("Curl Dial plan details updated ---"+dialplanxml);
            }
            catch (Exception e)
            {
                Logger.Error("Exception in dialplan Handler:"+e.ToString());
            }
     }


        public void SendXmlResponse(HttpContext context, String xmlresponse,Boolean isXml)
        {
            try
            {
                if(isXml){
                    context.Response.ContentType = "text/xml";
                }
                else
                {
                    context.Response.ContentType = "application/json";
                }                
                context.Response.Write(xmlresponse);
                
            }catch(Exception e){
                Logger.Error("Exception while sendin dialplan Xml to Context:"+e.ToString());

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