using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class Ticket
    {
        public Int64 Id { get; set; }
        public int Mode { get; set; }
        public int AccountId { get; set; }
        public int AgentId { get; set; }
        public int RoleId { get; set; }
        public int CustomerId { get; set; }
        public int PriorityId { get; set; }
        public int CategoryId { get; set; }
        public string DueDate { get; set; }
        public string Subject { get; set; }
        public string Decscription { get; set; }
        public string StatusIds { get; set; }
        public string PriorityIds { get; set; }
        public int TicketType { get; set; }
        public int OverDueType { get; set; }
        public int DurationType { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public bool IsStarred {get; set;}
        public int CallId { get; set; }
        public int SelectedAgentId { get; set; }
        public bool IsOffline { get; set; }
    }
}
