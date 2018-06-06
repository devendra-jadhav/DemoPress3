using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class CallHistory
    {
        public decimal Id { get; set; }
        public decimal CallId { get; set; }
        public byte EventId { get; set; }
        public string Digits { get; set; }
        public string RecordinngUrl { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public Nullable<int> TransferredFrom { get; set; }
        public Nullable<int> TransferredTo { get; set; }
    }
}
