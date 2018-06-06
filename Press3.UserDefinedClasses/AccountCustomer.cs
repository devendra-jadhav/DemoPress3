using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Press3.UserDefinedClasses
{
    public class AccountCustomer
    {
        public decimal Id { get; set; }
        public int AccountId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string MetaData { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public Nullable<System.DateTime> UpdatedTime { get; set; }
        public Nullable<int> UpdatedBy { get; set; }

    }
}
