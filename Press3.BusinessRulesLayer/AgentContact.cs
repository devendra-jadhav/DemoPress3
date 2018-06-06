using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using System.Data;
using Press3.Utilities;
using UDC = Press3.UserDefinedClasses;
using System.Web;
using System.Data.OleDb;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using System.Net.Mail;



namespace Press3.BusinessRulesLayer
{
    public class AgentContact
    {
         private Helper helper = null;
        public AgentContact ()
        {
            helper = new Helper();
            helper.ResponseFormat = "json";
            helper.InitializeResponseVariables();
        }

       public JObject AddContactDetails(String connection, string Number ,int agentId, string GroupName,string ExistingGroup,int mode,string Name,string Email, string notes,string Alternatemobile,string OldContact)
        { 
        try
         {
             Press3.DataAccessLayer.AgentContact ContactObject = new Press3.DataAccessLayer.AgentContact(connection);
             DataSet ds = ContactObject.AddContactDetails(connection, Number, agentId, GroupName, ExistingGroup, mode, Name, Email, notes, Alternatemobile, OldContact);
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
                helper.CreateProperty(UDC.Label.MESSAGE, ex.ToString());
                helper.CreateProperty(UDC.Label.SUCCESS, false);
                Logger.Error(ex.ToString());
            }
          return helper.GetResponse();
       }



       public JObject GetContactGroups(String connection, int agentId)
       {
           try
           {
               Press3.DataAccessLayer.AgentContact contactGroupObject = new Press3.DataAccessLayer.AgentContact(connection);
               DataSet ds = contactGroupObject.GetContactGroups(agentId);
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
               helper.CreateProperty("RetMessage", ex.ToString());
               Logger.Error("Exception In AgentLogout " + ex.ToString());
           }
           return helper.GetResponse();
       }
       public JObject GetContactTable(String connection, int agentId)
       {
           try
           {
               Press3.DataAccessLayer.AgentContact contactTablepObject = new Press3.DataAccessLayer.AgentContact(connection);
               DataSet ds = contactTablepObject.GetContactTable(agentId);
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
               helper.CreateProperty("RetMessage", ex.ToString());
               Logger.Error("Exception In AgentLogout " + ex.ToString());
           }
           return helper.GetResponse();
       }
       public JObject DeleteContact(String connection, int agentId,string Number)
       {
           try
           {
               Press3.DataAccessLayer.AgentContact deleteObject = new Press3.DataAccessLayer.AgentContact(connection);
               DataSet ds = deleteObject.DeleteContact(agentId, Number);
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
               helper.CreateProperty("RetMessage", ex.ToString());
               Logger.Error("Exception In AgentLogout " + ex.ToString());
           }
           return helper.GetResponse();
       }

       public JObject GetTableByGroups(String connection, int agentId, string groupName)
       {
           try
           {
               Press3.DataAccessLayer.AgentContact getObject = new Press3.DataAccessLayer.AgentContact(connection);
               DataSet ds = getObject.GetTableByGroups(agentId, groupName);
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
               helper.CreateProperty("RetMessage", ex.ToString());
               Logger.Error("Exception In AgentLogout " + ex.ToString());
           }
           return helper.GetResponse();
       }
 


    }
}
