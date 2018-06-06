using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using Press3.BusinessRulesLayer;
using Press3.Utilities;
using Press3.UI.CommonClasses;
using Newtonsoft.Json.Linq;
using UDC = Press3.UserDefinedClasses;

namespace Press3.UI.Handlers
{
    /// <summary>
    /// Summary description for Tickets
    /// </summary>
    public class Tickets : IHttpHandler ,IRequiresSessionState
    {
        public Int32 agentId = 0;
        public Int32 accountId = 0;
        public Int32 loginId = 0;
        public int roleId = 0;
        public JObject sessionObj = new JObject();
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                if (context.Session["AgentId"] != null)
                {
                    agentId = Convert.ToInt32(context.Session["AgentId"]);
                    loginId = Convert.ToInt32(context.Session["LoginId"]);
                    roleId = Convert.ToInt32(context.Session["RoleId"]);
                    if (context.Session["AccountId"] != null)
                        accountId = Convert.ToInt32(context.Session["AccountId"]);
                }
                else
                {
                    HttpContext.Current.Response.StatusCode = 401;
                    return;
                }


                try
                {
                    sessionObj = CheckSession(context);
                    //context.Response.Write(sessionObj);
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
                            int type = Convert.ToInt32(context.Request["type"]);
                            switch (type)
                            {
                                case 1: //  To get manager dashboard
                                    resJObj = ManageTicketCategoryNodes(context);
                                    context.Response.Write(resJObj);
                                    return;
                                case 2: //  To get manager dashboard
                                    resJObj = ManageTickets(context);
                                    context.Response.Write(resJObj);
                                    return;
                                case 3: //  To get tickets history
                                    resJObj = GetTicketsHistory(context);
                                    context.Response.Write(resJObj);
                                    return;
                                case 4: //  To get ticket priorities
                                    resJObj = GetTicketPriorities(context);
                                    context.Response.Write(resJObj);
                                    return;
                                case 5: //  get tickets to merge
                                    resJObj = GetTicketsToMerge(context);
                                    context.Response.Write(resJObj);
                                    return;
                                case 6: //  merge tickets
                                    resJObj = MergeTickets(context);
                                    context.Response.Write(resJObj);
                                    return;
                                case 7: //  close tickets
                                    resJObj = CloseTickets(context);
                                    context.Response.Write(resJObj);
                                    return;
                                case 8: //  star or unstar ticket
                                    resJObj = StarOrUnstarTicket(context);
                                    context.Response.Write(resJObj);
                                    return;
                                case 9: //  Get Ticket Details
                                    resJObj = GetTicketDetails(context);
                                    context.Response.Write(resJObj);
                                    return;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error("Exception in Session check:" + ex.ToString());
                }

            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
        }

        private JObject ManageTicketCategoryNodes(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Ticket ticketObj = new Press3.BusinessRulesLayer.Ticket();
                responseJObj = ticketObj.ManageTicketCategoryNodes(MyConfig.MyConnectionString, Convert.ToInt32(context.Request["Mode"]), accountId, context.Request["Category"].ToString(), Convert.ToInt32(context.Request["ParentId"]), context.Request["ColorCode"],agentId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }

        private JObject ManageTickets(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                UserDefinedClasses.Ticket ticketObj = new UserDefinedClasses.Ticket();
                ticketObj.Mode = Convert.ToInt32(context.Request["Mode"]);
                ticketObj.AccountId = accountId;
                ticketObj.AgentId = agentId;
                ticketObj.PriorityId = Convert.ToInt32(context.Request["PriorityId"]);
                ticketObj.Decscription = context.Request["Description"].ToString();
                if (Convert.ToInt32(context.Request["Mode"]) == 1)
                {
                    ticketObj.CategoryId = Convert.ToInt32(context.Request["CategoryId"]);
                    ticketObj.CustomerId = Convert.ToInt32(context.Request["CustomerId"]);
                    ticketObj.Subject = context.Request["Topic"].ToString();
                    ticketObj.DueDate = context.Request["DueDate"].ToString();
                    ticketObj.CallId = Convert.ToInt32(context.Request["CallId"]);
                    ticketObj.IsOffline = (context.Request["IsOffline"] != null && context.Request["IsOffline"] != "") ? Convert.ToBoolean(Convert.ToInt32(context.Request["IsOffline"])) : false;
                }
                else if (Convert.ToInt32(context.Request["Mode"]) == 2)
                {
                    ticketObj.Id = Convert.ToInt32(context.Request["TicketId"]);
                    ticketObj.StatusIds = context.Request["StatusId"].ToString();
                    ticketObj.CallId = (context.Request["CallId"] != null && context.Request["CallId"] != "") ? Convert.ToInt32(context.Request["CallId"]) : 0;
                }
                Press3.BusinessRulesLayer.Ticket ticketsObj = new Press3.BusinessRulesLayer.Ticket();
                responseJObj = ticketsObj.ManageTickets(MyConfig.MyConnectionString, ticketObj);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        public JObject CheckSession(HttpContext context)
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

        private JObject GetTicketsHistory(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                UDC.Ticket ticket = new UDC.Ticket();
                ticket.Mode = context.Request["mode"] != null ? Convert.ToInt32(context.Request["mode"]) : 0; ;
                ticket.AccountId = accountId;
                //ticket.AgentId = agentId;
                ticket.RoleId = roleId;
                if (roleId == 1)
                {
                    ticket.AgentId = agentId;
                    ticket.SelectedAgentId = agentId;
                }
                else
                {
                    ticket.AgentId = agentId;
                    ticket.SelectedAgentId = context.Request["agentId"] != null ? Convert.ToInt32(context.Request["agentId"]) : 0;

                }
               
                //ticket.SelectedAgentId = context.Request["agentId"] != null ? Convert.ToInt32(context.Request["agentId"]) : 0;
                ticket.Id = context.Request["ticketId"] != null ? Convert.ToInt64(context.Request["ticketId"]) : 0;
                ticket.Subject = context.Request["subject"];
                ticket.StatusIds = context.Request["statusIds"];
                ticket.PriorityIds = context.Request["priorityIds"];
                ticket.TicketType = context.Request["ticketType"] != null ? Convert.ToInt32(context.Request["ticketType"]) : 0;
                ticket.OverDueType = context.Request["overDueType"] != null ? Convert.ToInt32(context.Request["overDueType"]) : 0;
                ticket.DurationType = context.Request["durationType"] != null ? Convert.ToInt32(context.Request["durationType"]) : 0;
                ticket.CustomerId = context.Request["customerId"] != null ? Convert.ToInt32(context.Request["customerId"]) : 0;
                ticket.FromDate = context.Request["fromDate"];
                ticket.ToDate = context.Request["toDate"];
                ticket.PageIndex = Convert.ToInt32(context.Request["pageIndex"]);
                ticket.PageSize = Convert.ToInt32(context.Request["pageSize"]);
                ticket.IsStarred = context.Request["isStarred"] != null ? Convert.ToBoolean(Convert.ToInt16(context.Request["isStarred"])) : Convert.ToBoolean(Convert.ToInt16(0)); //Convert.ToBoolean(Convert.ToInt16(context.Request["isStarred"]));
                ticket.CategoryId = context.Request["CategoryId"] != "0" ? Convert.ToInt32(context.Request["CategoryId"]) : 0; 
                Press3.BusinessRulesLayer.Ticket ticketObj = new Press3.BusinessRulesLayer.Ticket();
                responseJObj = ticketObj.GetTicketsHistory(MyConfig.MyConnectionString, ticket);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }

        private JObject GetTicketPriorities(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Ticket ticketObj = new Press3.BusinessRulesLayer.Ticket();
                responseJObj = ticketObj.GetTicketPriorities(MyConfig.MyConnectionString, accountId);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject GetTicketsToMerge(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Ticket ticketObj = new Press3.BusinessRulesLayer.Ticket();
                responseJObj = ticketObj.GetTicketsToMerge(MyConfig.MyConnectionString, context.Request["ticketIds"]);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject MergeTickets(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Ticket ticketObj = new Press3.BusinessRulesLayer.Ticket();
                responseJObj = ticketObj.MergeTickets(MyConfig.MyConnectionString, agentId, context.Request["ticketIds"], Convert.ToInt32(context.Request["primaryTicketId"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject CloseTickets(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Ticket ticketObj = new Press3.BusinessRulesLayer.Ticket();
                responseJObj = ticketObj.CloseTickets(MyConfig.MyConnectionString, agentId, context.Request["ticketIds"], context.Request["closureText"]);
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject StarOrUnstarTicket(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Ticket ticketObj = new Press3.BusinessRulesLayer.Ticket();
                responseJObj = ticketObj.StarOrUnstarTicket(MyConfig.MyConnectionString, agentId, Convert.ToInt32(context.Request["ticketId"]), Convert.ToByte(context.Request["isStar"]));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
            }
            return responseJObj;
        }
        private JObject GetTicketDetails(HttpContext context)
        {
            JObject responseJObj = new JObject();
            try
            {
                Press3.BusinessRulesLayer.Ticket ticketObj = new Press3.BusinessRulesLayer.Ticket();
                responseJObj = ticketObj.GetTicketDetails(MyConfig.MyConnectionString, accountId, Convert.ToInt32(context.Request["ticketId"]));
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