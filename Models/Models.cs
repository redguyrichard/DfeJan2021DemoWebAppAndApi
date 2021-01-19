using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
// using Dapper.Contrib.Extensions;

namespace DfeJan2021DemoWebAppAndApi.Models
{
    public class Snapshot
    {
        [JsonProperty(PropertyName = "date")]
        public DateTime Date { get; set; }

        [JsonProperty(PropertyName = "trustCoaData")]
        public Dictionary<string, decimal> TrustCoaData { get; set; }

        [JsonProperty(PropertyName = "academies")]
        public IEnumerable<AcademyData> Academies { get; set; }
    }

    public class AcademyData
    {
        [JsonProperty(PropertyName = "academyUpin")]
        public int AcademyUpin { get; set; }

        [JsonProperty(PropertyName = "academyCoaData")]
        public Dictionary<string, decimal> AcademyCoaData { get; set; }

    }

    // [Table("DataSnapshots")]
    public class DataSnapshot
    {
        // [Key]
        public int Id { get; set; }
        public DateTime SnapshotDate { get; set; }
        public int TrustUkprn { get; set; }
        public int AcademyUpin { get; set; }

        public int CoaAccount { get; set; }
        public decimal CoaAccountValue { get; set; }

        // SnapshotDate DATETIME NOT NULL,
        // TrustUkprn INT NOT NULL, 
        // AcademyUpin INT,
        // CoaAccount INT NOT NULL,
        // CoaAccountValue DECIMAL(8,2) NOT NULL

    }

    /*
    [Table("coaData")]
    public class CoaData
    {
        [Key]
        public int Id { get; set; }
        public DateTime DDate { get; set; }
        public string TrustUkprn { get; set; }
        public string AcademyUpin { get; set; }

        public int Account { get; set; }
        public decimal Value { get; set; }
    }
    */
}
