using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using UDC = Press3.UserDefinedClasses;
using Press3.Utilities;
using System.Data;
using System.Data.OleDb;

namespace Press3.BusinessRulesLayer
{
   public class Scripts
    {
        private Helper _helper = null;
        public Scripts()
        {
            _helper = new Helper();
            _helper.ResponseFormat = UDC.ResponseFormat.JSON;
            _helper.InitializeResponseVariables();
        }
        public JObject GetScripts(string connectionString, int accountId)
        {
            try
            {
                if (accountId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "AccountId is mandatory");
                }
                else
                {
                    DataAccessLayer.Scripts ScriptObj = new DataAccessLayer.Scripts(connectionString);
                    System.Data.DataSet ds = ScriptObj.GetScripts(accountId);
                    if (ds == null)
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, ScriptObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }
        public JObject Create(string connectionString,string script,int accountId,int agentId)
        {
            try
            {
                JObject jsonObj = default(JObject);
                jsonObj = new JObject();
                jsonObj = JObject.Parse(script);
                string scriptTitle = jsonObj.SelectToken("ScriptTitle").ToString();
                int skillGroupId = Convert.ToInt32(jsonObj.SelectToken("SkillGroupId").ToString());
                int check = Convert.ToInt32(jsonObj.SelectToken("check").ToString());
                DataTable sectionsTable = new DataTable();
                sectionsTable.Columns.Add("Id", typeof(int));
                sectionsTable.Columns.Add("Name", typeof(string));
                DataTable topicsTable = new DataTable();
                topicsTable.Columns.Add("Title", typeof(string));
                topicsTable.Columns.Add("Description",typeof(string));
                topicsTable.Columns.Add("SectionId",typeof(int));
                JToken jUser = jsonObj["Sections"];
                int count = jUser.Count();
                int sectionId = 0;
                
                for (int i = 0; i < count; i++) {
                    sectionId = i + 1;
                    sectionsTable.Rows.Add(i+1, jUser[i].SelectToken("sectionTitle").ToString());
                    JArray items = (JArray)jUser[i].SelectToken("Topics");
                    int topicsCount = items.Count();
                    for (int j = 0; j < topicsCount; j++) { 
                        string title = items[j].SelectToken("Title").ToString();
                        string description = items[j].SelectToken("Description").ToString();
                        topicsTable.Rows.Add(title,description,sectionId);
                    }
                }



                DataAccessLayer.Scripts ScriptObj = new DataAccessLayer.Scripts(connectionString);
                System.Data.DataSet ds = ScriptObj.Create(scriptTitle, skillGroupId,check, sectionsTable, topicsTable,accountId,agentId);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, ScriptObj.ErrorMessage);
                    }
                    else
                        _helper.ParseDataSet(ds);
                
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();

        }

        public JObject Script(string connectionString, int accountId,string scriptTitle)
        {
            try
            {
                if (accountId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "AccountId is mandatory");
                }
                else
                {
                    DataAccessLayer.Scripts ScriptObj = new DataAccessLayer.Scripts(connectionString);
                    System.Data.DataSet ds = ScriptObj.Script(accountId,scriptTitle);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, ScriptObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }

        public JObject Delete(string connectionString,int accountId,int scriptId )
        {
            try
            {
                if (scriptId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "ScriptId is mandatory");
                }
                else
                {
                    Press3.DataAccessLayer.Scripts scriptObj = new Press3.DataAccessLayer.Scripts(connectionString);
                    System.Data.DataSet ds = scriptObj.Delete(accountId,scriptId);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, scriptObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }
        public JObject ViewScript(string connectionString, int accountId,int scriptId)
        {
            try
            {
                if (accountId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "AccountId is mandatory");
                }
                else
                {
                    DataAccessLayer.Scripts ScriptObj = new DataAccessLayer.Scripts(connectionString);
                    System.Data.DataSet ds = ScriptObj.ViewScript(accountId,scriptId);
                    if (ds == null)
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, ScriptObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }
        public JObject Update(string connectionString, string script,int accountId,int agentId)
        {
            try
            {
                JObject jsonObj = default(JObject);
                jsonObj = new JObject();
                jsonObj = JObject.Parse(script);
                int existScriptId = Convert.ToInt32(jsonObj.SelectToken("ScriptId").ToString());
                string scriptTitle = jsonObj.SelectToken("ScriptTitle").ToString();
                int skillGroupId = Convert.ToInt32(jsonObj.SelectToken("SkillGroupId").ToString());
                int check = Convert.ToInt32(jsonObj.SelectToken("check").ToString());
                DataTable sectionsTable = new DataTable();
                sectionsTable.Columns.Add("Id", typeof(int));
                sectionsTable.Columns.Add("Name", typeof(string));
                DataTable topicsTable = new DataTable();
                topicsTable.Columns.Add("Title", typeof(string));
                topicsTable.Columns.Add("Description", typeof(string));
                topicsTable.Columns.Add("SectionId", typeof(int));
                JToken jUser = jsonObj["Sections"];
                int count = jUser.Count();
                int sectionId = 0;

                for (int i = 0; i < count; i++)
                {
                    sectionId = i + 1;
                    sectionsTable.Rows.Add(i + 1, jUser[i].SelectToken("sectionTitle").ToString());
                    JArray items = (JArray)jUser[i].SelectToken("Topics");
                    int topicsCount = items.Count();
                    for (int j = 0; j < topicsCount; j++)
                    {
                        string title = items[j].SelectToken("Title").ToString();
                        string description = items[j].SelectToken("Description").ToString();
                        topicsTable.Rows.Add(title, description, sectionId);
                    }
                }


                DataTable ExistSectionsTable = new DataTable();
                ExistSectionsTable.Columns.Add("Id", typeof(int));
                ExistSectionsTable.Columns.Add("Name", typeof(string));
                ExistSectionsTable.Columns.Add("ScriptId", typeof(int));
                DataTable ExistTopicsTable = new DataTable();
                ExistTopicsTable.Columns.Add("TopicId",typeof(string));
                ExistTopicsTable.Columns.Add("Title", typeof(string));
                ExistTopicsTable.Columns.Add("Description", typeof(string));
                ExistTopicsTable.Columns.Add("SectionId", typeof(int));
                JToken jUserExist = jsonObj["ExistingSections"];
                int countExist = jUserExist.Count();


                for (int i = 0; i < countExist; i++)
                {
                    sectionId = Convert.ToInt32(jUserExist[i].SelectToken("sectionId").ToString());
                    ExistSectionsTable.Rows.Add(Convert.ToInt32(jUserExist[i].SelectToken("sectionId").ToString()), jUserExist[i].SelectToken("sectionTitle").ToString(),existScriptId);
                    JArray itemsExist = (JArray)jUserExist[i].SelectToken("Topics");
                    int topicsCountExist = itemsExist.Count();
                    for (int j = 0; j < topicsCountExist; j++)
                    {

                        string topicId = itemsExist[j].SelectToken("TopicId").ToString();
                        string title = itemsExist[j].SelectToken("Title").ToString();
                        string description = itemsExist[j].SelectToken("Description").ToString();
                        ExistTopicsTable.Rows.Add(topicId,title, description, sectionId);
                    }
                   
                }

                
                DataAccessLayer.Scripts ScriptObj = new DataAccessLayer.Scripts(connectionString);
                System.Data.DataSet ds = ScriptObj.Update(existScriptId,scriptTitle, skillGroupId, check, sectionsTable, topicsTable, ExistSectionsTable, ExistTopicsTable,accountId,agentId);
                if (ds.IsNull())
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, ScriptObj.ErrorMessage);
                }
                else
                    _helper.ParseDataSet(ds);
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();

        }
        public JObject GetScriptsSectionsTopics(string connectionString, int skillGroupId,int scriptId,int sectionId,int accountId,int mode)
        {
            try
            {
                DataAccessLayer.Scripts ScriptObj = new DataAccessLayer.Scripts(connectionString);
                System.Data.DataSet ds = ScriptObj.GetScriptsSectionsTopics(accountId,scriptId,sectionId,skillGroupId,mode);
                if (ds.IsNull())
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, ScriptObj.ErrorMessage);
                }
                else
                    _helper.ParseDataSet(ds);

            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();

        }

        public JObject DeleteSection(string connectionString, int accountId,int scriptId, int sectionId)
        {
            try
            {
                if (sectionId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "sectionId is mandatory");
                }
                else
                {
                    Press3.DataAccessLayer.Scripts scriptObj = new Press3.DataAccessLayer.Scripts(connectionString);
                    System.Data.DataSet ds = scriptObj.DeleteSection(accountId,scriptId,sectionId);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, scriptObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }

        public JObject DeleteTopic(string connectionString, int accountId, int sectionId,int topicId)
        {
            try
            {
                if (topicId == 0)
                {
                    _helper.CreateProperty(UDC.Label.SUCCESS, false);
                    _helper.CreateProperty(UDC.Label.MESSAGE, "TopicId is mandatory");
                }
                else
                {
                    Press3.DataAccessLayer.Scripts scriptObj = new Press3.DataAccessLayer.Scripts(connectionString);
                    System.Data.DataSet ds = scriptObj.DeleteTopic(accountId, sectionId,topicId);
                    if (ds.IsNull())
                    {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, scriptObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
            }
            catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }
        public JObject UploadExcelSections(string connectionString,string excelUploadPath,string fileName,string xlSheetData,string header,string scriptTitle,int skillGroupId,int check,int accountId,int agentId)
        {
            JObject jObj = new JObject();
            try
            {
                if (header == "1")
                {
                    header = "Yes";
                }
                else
                {
                    header = "No";
                }

                jObj = JObject.Parse(xlSheetData);
                string extension = System.IO.Path.GetExtension(fileName);
                JArray sheetArray = new JArray();
                sheetArray = jObj.SelectToken("data") as JArray;
                DataTable table = new DataTable();
                table.Columns.Add("sheetname", typeof(string));
                table.Columns.Add("columns", typeof(int));
                table.Columns.Add("section", typeof(string));
                table.Columns.Add("topic", typeof(string));
                table.Columns.Add("description", typeof(string));
                foreach (JObject _sheet in sheetArray)
                {
                    object[] val = new object[5];
                    val[0] = _sheet.SelectToken("sheetname").ToString();
                    val[1] = _sheet.SelectToken("columnscount").ToString();
                    val[2] = _sheet.SelectToken("section").ToString();
                    val[3] = _sheet.SelectToken("topic").ToString();
                    val[4] = _sheet.SelectToken("description").ToString();
                    table.Rows.Add(val);
                }
                string excelOleDbConstring = "";
                OleDbConnection oleDbCon = default(OleDbConnection);
                oleDbCon = null;
                if (extension == ".xlsx")
                {
                    excelOleDbConstring = excelOleDbConstring + "provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + excelUploadPath + fileName + ";Persist Security Info=True; Extended Properties=\"Excel 12.0;HDR=" + header + ";IMEX=1;\"";
                }
                else if (extension == ".xls")
                {
                    excelOleDbConstring = excelOleDbConstring + "provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + excelUploadPath + fileName + ";Persist Security Info=True; Extended Properties=\"Excel 8.0;HDR=" + header + ";IMEX=1;\"";
                }

                oleDbCon = new OleDbConnection(excelOleDbConstring);
                //oleDbCon = New OleDbConnection(excelOleDbConstring)
                OleDbCommand OleCmdSelect = null;
                OleDbDataAdapter OleAdapter = null;
                DataSet dSet = null;
                int secP = 0;
                int topP = 0;
                int desP = 0;

                JObject objectj = new JObject();
                
                int ColumnsCount = 0;
                string section = "", topic = "";
                string description = "";
                DataTable Tab = new DataTable();

                Tab.Columns.Add("section", typeof(string));
                Tab.Columns.Add("topic", typeof(string));
                Tab.Columns.Add("description", typeof(string));
                for (int k = 0; k <= table.Rows.Count - 1; k++)
                {
                    OleAdapter = null;
                    dSet = null;
                    OleCmdSelect = new OleDbCommand("SELECT   *  FROM [" + table.Rows[k]["sheetname"] + "$]", oleDbCon);
                    OleAdapter = new OleDbDataAdapter(OleCmdSelect);
                    dSet = new DataSet();
                    OleAdapter.Fill(dSet);
                    secP = 0;
                    topP = 0;
                    desP = 0;
                    //CountryCodeP = 0;
                    section = "";
                    topic = "";
                    description = "";
                    //countryC = "";
                    if (dSet.Tables[0].Columns.Count >= 2)
                    {
                        var _with1 = dSet.Tables[0];
                        ColumnsCount = dSet.Tables[0].Columns.Count;
                        secP = Convert.ToInt32(table.Rows[k]["section"]);
                        topP = Convert.ToInt32(table.Rows[k]["topic"]);
                        desP = Convert.ToInt32(table.Rows[k]["description"]);

                    }
                    string sectionName = "";
                    foreach (DataRow _Row in dSet.Tables[0].Rows)
                    {
                        
                        if (secP != 0 )
                        {
                            section = _Row[secP - 1].ToString();
                            if (section != "") {
                                sectionName = section;
                            }
                        }
                         

                        if (topP != 0)
                        {
                            topic = _Row[topP - 1].ToString();

                        }
                        if (desP != 0)
                        {
                            description = _Row[desP - 1].ToString();
                        }

                        if ((section != "" || section == "") && topic != "" && description != "")
                        {
                            if (section != "")
                            {
                                Tab.Rows.Add(section.Trim(), topic.Trim(), description.Trim());
                            }else
                                Tab.Rows.Add(sectionName, topic.Trim(), description.Trim());
                          
                        }

                    }
                }
                    Press3.DataAccessLayer.Scripts scriptObj = new Press3.DataAccessLayer.Scripts(connectionString);
                    System.Data.DataSet ds = scriptObj.UploadExcelSections(scriptTitle,skillGroupId,check, Tab,accountId,agentId);
                    if (ds.IsNull())
                     {
                        _helper.CreateProperty(UDC.Label.SUCCESS, false);
                        _helper.CreateProperty(UDC.Label.MESSAGE, scriptObj.ErrorMessage);
                    }
                    else
                    {
                        _helper.ParseDataSet(ds);
                    }
                }
             catch (Exception e)
            {
                Utilities.Logger.Error(e.ToString());
                _helper.InitializeResponseVariables();
                _helper.CreateProperty(UDC.Label.SUCCESS, false);
                _helper.CreateProperty(UDC.Label.MESSAGE, e.Message);
            }
            return _helper.GetResponse();
        }

            }
           
       

    }

