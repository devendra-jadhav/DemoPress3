using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using Press3.Utilities;
using UDC = Press3.UserDefinedClasses;

namespace Press3.DataAccessLayer
{
    public class Ticket : DataAccess
    {
        SqlCommand _cmd;
        SqlDataAdapter _da;
        DataSet _ds;
        readonly Helper _helper = new Helper();
        public Ticket(string sConstring) : base(sConstring) { }

        public DataSet ManageTicketCategoryNodes(int mode, int accountId, string category, int parentId, string colorCode,int agentId)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "ManageTicketCategoryNodes";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@Mode", SqlDbType.VarChar, -1).Value = mode;
                _cmd.Parameters.Add("@Category", SqlDbType.VarChar, 50).Value = category;
                _cmd.Parameters.Add("@ParentId", SqlDbType.Int).Value = parentId;
                _cmd.Parameters.Add("@ColorCode", SqlDbType.VarChar, 50).Value = colorCode;
                _cmd.Parameters.Add("@CategoryId", SqlDbType.Int).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                 _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "TicketCategoryNodes";

                    if(mode == 5)
                    {
                        _ds.Tables[1].TableName = "TicketPriorities";
                        _ds.Tables[2].TableName = "TicketStatus";
                    }
                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw;
            }
            finally
            {
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        }

        public DataSet ManageTickets(UserDefinedClasses.Ticket ticketsObj)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {

                _cmd.CommandText = "TicketManagement";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Mode", SqlDbType.Int).Value = ticketsObj.Mode;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = ticketsObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = ticketsObj.AgentId;
                _cmd.Parameters.Add("@PriorityId", SqlDbType.Int).Value = ticketsObj.PriorityId;
                _cmd.Parameters.Add("@Description", SqlDbType.NVarChar, -1).Value = ticketsObj.Decscription;
                if (ticketsObj.Mode == 1)
                {
                    _cmd.Parameters.Add("@CategoryId", SqlDbType.Int).Value = ticketsObj.CategoryId;
                    _cmd.Parameters.Add("@CallId", SqlDbType.Int).Value = ticketsObj.CallId;
                    _cmd.Parameters.Add("@CustomerId", SqlDbType.Int).Value = ticketsObj.CustomerId;
                    _cmd.Parameters.Add("@Subject", SqlDbType.NVarChar, 100).Value = ticketsObj.Subject;
                    _cmd.Parameters.Add("@DueDate", SqlDbType.VarChar, 50).Value = ticketsObj.DueDate;
                    _cmd.Parameters.Add("@IsOffline", SqlDbType.Bit).Value = ticketsObj.IsOffline;
                }
                else if(ticketsObj.Mode == 2)
                {
                    _cmd.Parameters.Add("@TicketId", SqlDbType.Int).Value = ticketsObj.Id;
                    _cmd.Parameters.Add("@StatusId", SqlDbType.Int).Value = Convert.ToInt32(ticketsObj.StatusIds);
                    _cmd.Parameters.Add("@CallId", SqlDbType.Int).Value = ticketsObj.CallId;
                }
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "TicketDetails";

                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw;
            }
            finally
            {
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        }
        public DataSet GetTicketsHistory(UserDefinedClasses.Ticket ticketsObj)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {

                _cmd.CommandText = "GetTicketsHistory";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@Mode", SqlDbType.Int).Value = ticketsObj.Mode;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = ticketsObj.AccountId;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = ticketsObj.AgentId;
                _cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = ticketsObj.RoleId;
                _cmd.Parameters.Add("@TicketId", SqlDbType.BigInt).Value = ticketsObj.Id;
                _cmd.Parameters.Add("@CustomerId", SqlDbType.Int).Value = ticketsObj.CustomerId;
                _cmd.Parameters.Add("@SelectedAgentId", SqlDbType.Int).Value = ticketsObj.SelectedAgentId;
                _cmd.Parameters.Add("@StatusIds", SqlDbType.VarChar, 50).Value = ticketsObj.StatusIds;
                _cmd.Parameters.Add("@PriorityIds", SqlDbType.VarChar, 50).Value = ticketsObj.PriorityIds;
                _cmd.Parameters.Add("@TicketType", SqlDbType.Int).Value = ticketsObj.TicketType;
                _cmd.Parameters.Add("@OverDueType", SqlDbType.Int).Value = ticketsObj.OverDueType;
                _cmd.Parameters.Add("@DurationType", SqlDbType.Int).Value = ticketsObj.DurationType;
                _cmd.Parameters.Add("@FromDate", SqlDbType.VarChar, 30).Value = ticketsObj.FromDate;
                _cmd.Parameters.Add("@ToDate", SqlDbType.VarChar, 30).Value = ticketsObj.ToDate;
                _cmd.Parameters.Add("@PageIndex", SqlDbType.Int).Value = ticketsObj.PageIndex;
                _cmd.Parameters.Add("@IsStarred", SqlDbType.Bit).Value = ticketsObj.IsStarred;
                _cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = ticketsObj.PageSize;
                _cmd.Parameters.Add("@Subject", SqlDbType.NVarChar, 100).Value = ticketsObj.Subject;
                _cmd.Parameters.Add("@CategoryId", SqlDbType.Int).Value = ticketsObj.CategoryId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                //_cmd.Parameters.Add("@TotalTickets", SqlDbType.Int).Direction = ParameterDirection.Output;
                //_cmd.Parameters.Add("@OverDueCount", SqlDbType.Int).Direction = ParameterDirection.Output;
                //_cmd.Parameters.Add("@TodayDueCount", SqlDbType.Int).Direction = ParameterDirection.Output;
                //_cmd.Parameters.Add("@TicketsOpenCount", SqlDbType.Int).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "TicketDetails";
                    _ds.Tables[1].TableName = "Tickets";

                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw;
            }
            finally
            {
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        }
        public DataSet GetTicketPriorities(int accountId)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "GetTicketPriorities";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "TicketPriorities";
                    _ds.Tables[1].TableName = "TicketStatuses";
                    _ds.Tables[2].TableName = "TicketCategoryNodes";

                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw;
            }
            finally
            {
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        }
        public DataSet GetTicketsToMerge(string ticketIds)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "GetTicketsToMerge";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@TicketIds", SqlDbType.VarChar, -1).Value = ticketIds;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "TicketDetails";

                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw;
            }
            finally
            {
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        }
        public DataSet MergeTickets(int agentId, string ticketIds, int primaryTicketId)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "MergeTickets";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@PrimaryTicketId", SqlDbType.Int).Value = primaryTicketId;
                _cmd.Parameters.Add("@TicketIds", SqlDbType.VarChar, -1).Value = ticketIds;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                Connection.Open();
                _cmd.ExecuteNonQuery();
                Connection.Close();
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw;
            }
            finally
            {
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        }
        public DataSet CloseTickets(int agentId, string ticketIds, string closureText)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "CloseTickets";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@TicketIds", SqlDbType.VarChar, -1).Value = ticketIds;
                _cmd.Parameters.Add("@ClosureText", SqlDbType.VarChar, 1000).Value = closureText;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                Connection.Open();
                _cmd.ExecuteNonQuery();
                Connection.Close();
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw;
            }
            finally
            {
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        }
        public DataSet StarOrUnstarTicket(int agentId, int ticketId, byte isStar)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "StarOrUnstarTicket";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AgentId", SqlDbType.Int).Value = agentId;
                _cmd.Parameters.Add("@TicketId", SqlDbType.Int).Value = ticketId;
                _cmd.Parameters.Add("@IsStar", SqlDbType.Bit).Value = isStar;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                Connection.Open();
                _cmd.ExecuteNonQuery();
                Connection.Close();
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw;
            }
            finally
            {
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        }

        public DataSet GetTicketDetails(int accountId,int ticketId)
        {
            _cmd = new SqlCommand();
            _da = new SqlDataAdapter();
            _ds = new DataSet();
            try
            {
                _cmd.CommandText = "GetTicketConversations";
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Connection = Connection;
                _cmd.Parameters.Add("@AccountId", SqlDbType.Int).Value = accountId;
                _cmd.Parameters.Add("@TicketId", SqlDbType.Int).Value = ticketId;
                _cmd.Parameters.Add("@Message", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                _cmd.Parameters.Add("@Success", SqlDbType.Bit).Direction = ParameterDirection.Output;
                _da.SelectCommand = _cmd;
                _da.Fill(_ds);
                if (_ds.Tables.Count > 0)
                {
                    _ds.Tables[0].TableName = "TicketDetails";

                }
                _ds.Tables.Add(_helper.ConvertOutputParametersToDataTable(_cmd.Parameters));
            }
            catch (Exception ex)
            {
                Logger.Error(ex.ToString());
                throw;
            }
            finally
            {
                Connection.Close();
                _cmd = null;
            }
            return _ds;
        }

    }
}
