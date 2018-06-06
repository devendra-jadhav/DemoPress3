using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class TicketStatus
    {
        public int AccountId { get; set; }
        public int AgentId { get; set; }
        public byte Mode { get; set; }
        public int Id { get; set; }
        public string Status { get; set; }
        public string ColorCode { get; set; }
    }
}
