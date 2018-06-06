using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using Press3.DataAccessLayer;
using Press3.Utilities;
using Newtonsoft.Json.Linq;
using UDC = Press3.UserDefinedClasses;

namespace Press3.BusinessRulesLayer
{
    public class Ticket
    {
        private Helper helper = null;
        public Ticket()
        {
            helper = new Helper();
            helper.ResponseFormat = "json";
            helper.InitializeResponseVariables();
        }

        public JObject ManageTicketCategoryNodes(String connection, int mode, int accountId, string category, int parentId, string colorCode,int agentId)
        {
            try
            {
                Press3.DataAccessLayer.Ticket ticketObj = new Press3.DataAccessLayer.Ticket(connection);
                DataSet ds = ticketObj.ManageTicketCategoryNodes(mode, accountId, category, parentId, colorCode,agentId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In GetAgentStatuses " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject ManageTickets(String connection, UserDefinedClasses.Ticket ticketsObj)
        {
            try
            {
                Press3.DataAccessLayer.Ticket ticketObj = new Press3.DataAccessLayer.Ticket(connection);
                DataSet ds = ticketObj.ManageTickets(ticketsObj);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In GetAgentStatuses " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetTicketsHistory(String connection, UserDefinedClasses.Ticket ticket)
        {
            try
            {
                Press3.DataAccessLayer.Ticket ticketObj = new Press3.DataAccessLayer.Ticket(connection);
                DataSet ds = ticketObj.GetTicketsHistory(ticket);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In GetTicketsHistory " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetTicketsToMerge(String connection, string ticketIds)
        {
            try
            {
                Press3.DataAccessLayer.Ticket ticketObj = new Press3.DataAccessLayer.Ticket(connection);
                DataSet ds = ticketObj.GetTicketsToMerge(ticketIds);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In GetTicketsToMerge " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetTicketPriorities(String connection, int accountId)
        {
            try
            {
                Press3.DataAccessLayer.Ticket ticketObj = new Press3.DataAccessLayer.Ticket(connection);
                DataSet ds = ticketObj.GetTicketPriorities(accountId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In GetTicketPriorities " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject MergeTickets(String connection, int agentId, string ticketIds, int primaryTicketId)
        {
            try
            {
                Press3.DataAccessLayer.Ticket ticketObj = new Press3.DataAccessLayer.Ticket(connection);
                DataSet ds = ticketObj.MergeTickets(agentId, ticketIds, primaryTicketId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In MergeTickets " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject CloseTickets(String connection, int agentId, string ticketIds, string closureText)
        {
            try
            {
                Press3.DataAccessLayer.Ticket ticketObj = new Press3.DataAccessLayer.Ticket(connection);
                DataSet ds = ticketObj.CloseTickets(agentId, ticketIds, closureText);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In CloseTickets " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject StarOrUnstarTicket(String connection, int agentId, int ticketId, byte isStar)
        {
            try
            {
                Press3.DataAccessLayer.Ticket ticketObj = new Press3.DataAccessLayer.Ticket(connection);
                DataSet ds = ticketObj.StarOrUnstarTicket(agentId, ticketId, isStar);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In StarOrUnstarTicket " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject GetTicketDetails(String connection, int accountId, int ticketId)
        {
            try
            {
                Press3.DataAccessLayer.Ticket ticketObj = new Press3.DataAccessLayer.Ticket(connection);
                DataSet ds = ticketObj.GetTicketDetails(accountId, ticketId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In StarOrUnstarTicket " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public DataSet DownloadTicketsHistory(String connection, UserDefinedClasses.Ticket ticket)
        {
            DataSet ds = new DataSet();
            try
            {
                Press3.DataAccessLayer.Ticket ticketObj = new Press3.DataAccessLayer.Ticket(connection);
                ds = ticketObj.GetTicketsHistory(ticket);
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In DownloadTicketsHistory " + ex.ToString());
            }
            return ds;
        }
    }
}
