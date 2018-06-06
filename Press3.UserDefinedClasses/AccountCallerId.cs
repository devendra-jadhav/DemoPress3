using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class AccountCallerId
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int CallerIdId { get; set; }
        public byte Status { get; set; }
        public System.DateTime ExpiryDate { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public Nullable<System.DateTime> UpdatedTime { get; set; }

       
    }
}
