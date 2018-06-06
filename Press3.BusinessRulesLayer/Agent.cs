using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Data;
using System.Web;
using System.Web.SessionState;
using Newtonsoft.Json.Linq;
using Press3.Utilities;
using UDC = Press3.UserDefinedClasses;
using SD = System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace Press3.BusinessRulesLayer
{
    public class Agent
    {
        private Helper helper = null;
        public Agent()
        {
            helper = new Helper();
            helper.ResponseFormat = "json";
            helper.InitializeResponseVariables();
        }
        public JObject AgentLogin(String connection, UDC.AgentLogin agentLoginObj)
        {
            string hashPassword = string.Empty;
            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                byte[] bytesBefore = Encoding.Unicode.GetBytes(agentLoginObj.Password);
                byte[] bytesAfter = HashAlgorithm.Create("SHA1").ComputeHash(bytesBefore);
                hashPassword = Convert.ToBase64String(bytesAfter);
                agentLoginObj.Password = hashPassword;
                DataSet ds = agentObject.AgentLogin(agentLoginObj);
                if (ds == null || ds.Tables.Count == 0)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }else{
                    if (ds.Tables.Count > 1)
                    {
                        if (Convert.ToBoolean(ds.Tables[1].Rows[0]["Success"]))
                        {
                            string sessionId = Guid.NewGuid().ToString();
                            HttpCookie SessCookie = new HttpCookie("Press3Cookie", sessionId);
                            SessCookie.HttpOnly = true;
                            SessCookie.Values.Add("LoginId", ds.Tables[0].Rows[0]["LoginId"].ToString());
                            SessCookie.Values.Add("AgentId", ds.Tables[0].Rows[0]["Id"].ToString());
                            SessCookie.Values.Add("AccountId", ds.Tables[0].Rows[0]["AccountId"].ToString());
                            SessCookie.Values.Add("RoleId", ds.Tables[0].Rows[0]["RoleId"].ToString());
                            SessCookie.Values.Add("AgentName", ds.Tables[0].Rows[0]["Name"].ToString());
                            HttpContext.Current.Response.Cookies.Add(SessCookie);
                           // StudioController studioControllerObj = new StudioController();
                           // studioControllerObj.ManagerDashBoardCounts(connection, Convert.ToInt32(ds.Tables[0].Rows[0]["AccountId"]), "AgentLogin");
                        }
                    }
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In AgentLogin " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetAgentGatewayDetails(String connection,int agentId,int accountId)
        {
            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.GetAgentGatewayDetails(agentId);
                if(ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                   
                }
            }
            catch(Exception ex)
            {
                Logger.Error("Exception In GetAgentGatewayDetails " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetAgentScriptsAndCallSummary(String connection, int agentId)
        {
            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.GetAgentScriptsAndCallSummary (agentId);
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
                Logger.Error("Exception In GetAgentGatewayDetails " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject AgentLogout(String connection, Int32 loginId, Int32 agentId, Byte isAutoLogout = 0)
        {
            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.AgentLogout(loginId, agentId, isAutoLogout);
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
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject ChangeSipRegistrationStatus(String connection, int status, Int32 agentId,int accountId)
        {
            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.ChangeSipRegistrationStatus(status, agentId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                    //Press3.BusinessRulesLayer.StudioController scObj = new Press3.BusinessRulesLayer.StudioController();
                    //scObj.ManagerDashBoardCounts(connection, accountId, "VertoLogin");
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject ChangeAgentStatus(String connection, string status, Int32 agentId,Int32 accountId)
        {
            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.ChangeAgentStatus(status, agentId);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                    Press3.BusinessRulesLayer.StudioController scObj = new Press3.BusinessRulesLayer.StudioController();
                    scObj.ManagerDashBoardCounts(connection, accountId, "ChangeStatus");
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject GetAvailableAgents(String connection,  int accountId,int callId)
        {
            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.GetAvailableAgents(accountId,callId);
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
                Logger.Error("Exception In AgentLogout " + ex.ToString());
            }
            return helper.GetResponse();
        }
        public JObject GetAgentStatuses(String connection,Int32 agentId)
        {
            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.GetAgentStatuses(agentId);
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

        public JObject GetAgentCreationRelatedData(String connection,int agentId)
        {
            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.GetAgentCreationRelatedData(agentId);
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
        public JObject AgentsMangement(String connection,UserDefinedClasses.Agent agentsObj)
        {
            try
            {
                if (agentsObj.Mode == 1 || agentsObj.Mode == 3)
                {
                    if(string.IsNullOrEmpty(Convert.ToString(agentsObj.Password)) != true)
                    {
                        string hashPassword = string.Empty;
                        byte[] bytesBefore = Encoding.Unicode.GetBytes(agentsObj.Password);
                        byte[] bytesAfter = HashAlgorithm.Create("SHA1").ComputeHash(bytesBefore);
                        hashPassword = Convert.ToBase64String(bytesAfter);
                        agentsObj.Password = hashPassword;
                    }
                    
                }
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.AgentsManagement(agentsObj);
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

        public JObject UpdateProfileImage(String connection, int accountId, int agentId, string profileImage)
        {
            try
            {
                string tempStoragePath = HttpContext.Current.Server.MapPath("/Images/ProfileImages/");
                string tempFileName = DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".jpg";

                if (!String.IsNullOrEmpty(profileImage))
                {
                    Image _image = null;
                    MemoryStream mStream = new MemoryStream();
                    byte[] byteArr;
                    byteArr = Convert.FromBase64String(profileImage.Replace(" ", "+").Replace("data:image/png;base64,", ""));
                    mStream = new MemoryStream(byteArr);
                    _image = Image.FromStream(mStream);
                    _image.Save(tempStoragePath + tempFileName);
                }
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.UpdateProfileImage(accountId, agentId, "/Images/ProfileImages/" + tempFileName);
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

        public JObject GetAgents(String connection, int accountId, string SearchText, int accStatusId, int agentTypeId, int deviceStatusId)
        {
            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.GetAgents(accountId, SearchText, accStatusId, agentTypeId, deviceStatusId);
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
                Logger.Error("Exception In GetAgents " + ex.ToString());
            }
            return helper.GetResponse();
        }


        public JObject GetProfileDetails(string connection, int agentid)
        {
            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.GetProfileDetails(agentid);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from the database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In GetProfileDetails" + ex.ToString());
            }
            return helper.GetResponse();
        }


        public JObject CheckExtSipUnameExistance(string connection, string extSipUname, int agentId, int mode)
        {

            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.CheckExtSipUnameExistance(extSipUname, agentId, mode);
                if (ds == null)
                {
                    helper.CreateProperty(UDC.Label.MESSAGE, "No data returned from the database");
                    helper.CreateProperty(UDC.Label.SUCCESS, false);
                }
                else
                {
                    helper.ParseDataSet(ds);
                }
            }
            catch (Exception ex)
            {
                Logger.Error("Exception In GetProfileDetails" + ex.ToString());
            }
            return helper.GetResponse();

        }

        public JObject GetAgentInformation(String connection, int accountId, int agentId)
        {
            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.GetAgentInformation(accountId,agentId);
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
                Logger.Error("Exception In GetAgentInformation " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject GetStatusChangeDatewise(String connection, int accountId, int agentId,string date)
        {
            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.GetStatusChangeDatewise(accountId, agentId, date);
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
                Logger.Error("Exception In GetAgentInformation " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject GetPress3Health(string connection, int accountId, int roleId, int LoginRequired, int deviceStatusId, int LoginStatus, int DeviceType)
        {
            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.GetPress3Health(accountId, roleId, LoginRequired, deviceStatusId, LoginStatus, DeviceType);
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
                Logger.Error("Exception In GetAgentInformation " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject GetOpenCbrCount(string connection, int agentId , int accountId)
        {
            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.GetOpenCbrCount(agentId,accountId);
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
                Logger.Error("Exception In GetAgentInformation " + ex.ToString());
            }
            return helper.GetResponse();
        }

        public JObject LoginTimePolling(string connection, int agentId, int loginId)
        {
            try
            {
                Press3.DataAccessLayer.Agent agentObject = new Press3.DataAccessLayer.Agent(connection);
                DataSet ds = agentObject.LoginTimePolling(agentId,loginId);
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
                Logger.Error("Exception In GetAgentInformation " + ex.ToString());
            }
            return helper.GetResponse();
        }
    }
}
