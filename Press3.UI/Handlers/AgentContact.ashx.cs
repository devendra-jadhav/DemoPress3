using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json.Linq;
using Press3.BusinessRulesLayer;
using System.Web.SessionState;
using Press3.UI.CommonClasses;
using Press3.UI.AppCode;
using Press3.Utilities;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for AgentContact
    /// </summary>
    public class AgentContact : IHttpHandler, IRequiresSessionState
    {
        public int agentId = 0, accountId = 0;
        public JObject sessionObj = new JObject();
        public Int32 loginId = 0;
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                if (context.Session["AgentId"] != null)
                {
                    agentId = Convert.ToInt32(context.Session["AgentId"]);
                    loginId = Convert.ToInt32(context.Session["LoginId"]);
                    if (context.Session["AccountId"] != null)
                        accountId = Convert.ToInt32(context.Session["AccountId"]);
                }
                else
                {
                    HttpContext.Current.Response.StatusCode = 401;
                    return;
                }

                int type = Convert.ToInt32(context.Request["type"]);
                sessionObj = CheckSession(context);

                if (sessionObj != null)
                {
                    if (sessionObj.SelectToken("Success").ToString() == "False")
                    {
                        HttpContext.Current.Response.StatusCode = 406;
                        return;
                    }
                    else
                    {
                        JObject resJObj = new JObject();
                        switch (type)
                        {
                            case 1:
                                resJObj = AddContact(context);
                                context.Response.Write(resJObj);
                                break;
                            case 2:
                                resJObj = GetContactGroups(context);
                                context.Response.Write(resJObj);
                                break;
                            case 3:
                                resJObj = GetContactTable(context);
                                context.Response.Write(resJObj);
                                break;
                            case 4:
                                resJObj = DeleteContact(context);
                                context.Response.Write(resJObj);
                                break;
                            case 5:
                                resJObj = GetTableByGroups(context);
                                context.Response.Write(resJObj);
                                break;


                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            
        }



        private JObject CheckSession(HttpContext context)
        {
            JObject resultObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Manager managerObj = new Press3.BusinessRulesLayer.Manager();
                resultObj = managerObj.CheckSession(MyConfig.MyConnectionString, loginId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return resultObj;
        }

        private JObject AddContact(HttpContext context)
        {
            JObject callerDetails = new JObject();
            try{
            
            Press3.BusinessRulesLayer.AgentContact contactObject = new Press3.BusinessRulesLayer.AgentContact();
            callerDetails = contactObject.AddContactDetails(MyConfig.MyConnectionString, Convert.ToString(context.Request["ContactsMobile"]), agentId, context.Request["GroupName"].ToString(), context.Request["ExistingGroup"].ToString(), Convert.ToInt32(context.Request["Mode"]), context.Request["ContactName"].ToString(), context.Request["ContactEmail"].ToString(), context.Request["Notes"].ToString(), context.Request["AlternateMobile"].ToString(),context.Request["OldContact"].ToString());
            }
            catch (Exception ex)
            {
                callerDetails = new JObject(new JProperty("Success", "False"),
                    new JObject("Message", ex.ToString()));
                Logger.Error(ex.ToString());
            }

           
        return callerDetails;
        
        
        }
        private JObject GetContactGroups(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.AgentContact groupObject = new Press3.BusinessRulesLayer.AgentContact();
                responseJObj = groupObject.GetContactGroups(MyConfig.MyConnectionString, agentId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject GetContactTable(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.AgentContact contactTableObject = new Press3.BusinessRulesLayer.AgentContact();
                responseJObj = contactTableObject.GetContactTable(MyConfig.MyConnectionString, agentId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject DeleteContact(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.AgentContact deleteObject = new Press3.BusinessRulesLayer.AgentContact();
                responseJObj = deleteObject.DeleteContact(MyConfig.MyConnectionString, agentId, Convert.ToString(context.Request["ContactNumber"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject GetTableByGroups(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.AgentContact getObject = new Press3.BusinessRulesLayer.AgentContact();
                responseJObj = getObject.GetTableByGroups(MyConfig.MyConnectionString, agentId, Convert.ToString(context.Request["GroupName"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
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