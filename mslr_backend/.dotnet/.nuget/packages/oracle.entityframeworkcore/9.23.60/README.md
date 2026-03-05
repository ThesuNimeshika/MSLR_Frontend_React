![Oracle Logo](https://raw.githubusercontent.com/oracle/dotnet-db-samples/master/images/oracle-nuget.png) 
# Oracle.EntityFrameworkCore 9.23.60
Release Notes for Oracle Entity Framework Core 9 NuGet Package

December 2024

Oracle Data Provider for .NET (ODP.NET) Entity Framework (EF) Core is a database provider that allows Entity Framework Core to be used with Oracle databases. EF Core is a cross-platform Microsoft object-relational mapper that enables .NET developers to work with relational databases using .NET objects.

This document provides information that supplements the [Oracle Data Provider for .NET (ODP.NET) documentation](https://docs.oracle.com/en/database/oracle/oracle-database/23/odpnt/index.html).

## Oracle .NET Links
* [Oracle .NET Home Page](https://www.oracle.com/database/technologies/appdev/dotnet.html)
* [GitHub - Sample Code](https://github.com/oracle/dotnet-db-samples)
* [ODP.NET Discussion Forum](https://forums.oracle.com/ords/apexds/domain/dev-community/category/odp-dot-net)
* [YouTube](https://www.youtube.com/user/OracleDOTNETTeam)
* [X (Twitter)](https://twitter.com/oracledotnet)
* [Email Newsletter Sign Up](https://go.oracle.com/LP=28277?elqCampaignId=124071&nsl=onetdev)

## New Features
* Entity Framework Core 9 Support
* VectorDistance(), VectorEmbedding(), and ToVector() DbContext Extension Method Support

## Bug Fixes since Oracle.EntityFrameworkCore 8.23.60
* Bug 37181655 - IDEMPOTENT SCRIPT MISSING EXECUTE IMMEDIATE FOR TRIGGERS
* Bug 37265049 - VECTOR COLUMNS MAP TO STRING INTEAD OF TO PRIMITIVE ARRAYS (BYTE[]/INT16[]/FLOAT[]/DOUBLE[]) BY DEFAULT

## Tips, Limitations, and Known Issues
#### Code First
* The HasIndex() Fluent API cannot be invoked on an entity property that will result in a primary key in the Oracle database. Oracle Database does not support index creation for primary keys since an index is implicitly created for all primary keys.
 * The HasFilter() Fluent API is not supported. For example, 
```csharp
modelBuilder.Entity<Blog>()
    .HasIndex(b => b.Url)
    .HasFilter("Url is not null");
```
 * Data seeding using the UseIdentityColumn is not supported.
 * The UseCollation() Fluent API is not supported.
 * The DateOnly and TimeOnly types are not supported.
 * DatabaseTable.Indexes() is not supported for descending indexes. 
 * The following usage is not supported because of a limitation in the provider: -> HasColumnType("float").HasPrecision(38).
As a workaround, set the precision value in the HasColumnType() fluent API instead of explicitly using the HasPrecision() fluent API, e.g., HasColumnType("float (38)").
NOTE: Except for 38 as a precision value, other precision values between 1 and 126 can be set using the HasPrecision() Fluent API. This limitation and workaround also apply when annotations are used instead of the above mentioned fluent API's.
#### Computed Columns
* Literal values used for computed columns must be encapsulated by two single-quotes. In the example below, the literal string is the comma. It needs to be surrounded by two single-quotes as shown below.
```csharp
// C# - computed columns code sample
modelBuilder.Entity<Blog>()
    .Property(b => b.BlogOwner)
    .HasComputedColumnSql("\"LastName\" || '','' || \"FirstName\"");
```
#### Database Scalar Function Mapping
* Database scalar function mapping does not provide a native way to use functions residing within PL/SQL packages. To work around this limitation, map the package and function to an Oracle synonym, then map the synonym to the EF Core function.
#### LINQ
* LINQ queries that are used to query or restore historical (temporal) data are not supported.
* LINQ queries that are used to query the DateOnly and TimeOnly types are not supported.
* HasRowsAffectedReturnValue is not supported because Oracle does not support having a return value from a stored procedure. For example,
```csharp
modelBuilder.Entity<Person>()
    .UpdateUsingStoredProcedure(
        "People_Update",
        storedProcedureBuilder =>
        {
            storedProcedureBuilder.HasRowsAffectedReturnValue(true)
        });
```
* Certain LINQs cannot be executed against Oracle Database 21c or lower. Let us first imagine an entity model with the following entity:
```csharp
public class MyTable
{
    public int Id { get; set; }
    public int? Value { get; set; }
}
```
The following LINQ will not work against Oracle Database 21c or lower:
```csharp
var query = from t in context.Table
    group t.Id by t.Value
    into tg
    select new
    {
        A = tg.Key,
        B = context.Table.Where(t => t.Value == tg.Max() * 6).Max(t => (int?)t.Id)
    };
```
This is due to LINQ creating the following SQL query:
```sql
SELECT "t"."Value" "A", "t"."Id", (
    SELECT MAX("t0"."Id")
    FROM "MyTable" "t0"
    WHERE (("t0"."Value" = "t"."Id") OR ("t0"."Value" IS NULL AND MAX("t"."Id") IS NULL))) "B"
FROM "MyTable" "t"
GROUP BY "t"."Value"
```
The issue is because the inner select query uses a MAX function which refers to a column from the outer select query. Also the way in which the MAX function is used within the WHERE clause is not supported in Oracle Database. The same issue is also applicable when the MIN function is used.
* Oracle DB doesn't support UPDATE queries with FROM clause in DB 21c or lower. So certain LINQs cannot be executed against Oracle Database which generate UPDATE query with FROM clause. For example, imagine an entity model with the following entities:
```csharp
public class Blog
{
    public int Id { get; private set; }
    public string Name { get; set; }
    public List<Post> Posts { get; } = new();
}

public class Post
{
    public int Id { get; private set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime PublishedOn { get; set; }
}
```
Trying to update the Blog.Name using below LINQ would throw 'ORA-00933: SQL command not properly ended'
```csharp
var query = from blog in context.Set<Blog>().Where(c => c.Name == "MyBlog")
    join post in context.Set<Post>().Where(p => p.Title == "Oracle")
    on blog.Name equals post.Title
    select new { blog, post };
var updateQuery = query.ExecuteUpdate(s => s.SetProperty(c => c.blog.Name, "Updated"));
```
This is due to LINQ creating the following SQL query, which Oracle database does not support.
```sql
UPDATE "Blogs" "b"
SET "b"."Name" = N'Updated'
FROM (
    SELECT "p"."Id", "p"."BlogId", "p"."Content", "p"."PublishedOn", "p"."Title"
    FROM "Posts" "p"
    WHERE "p"."Title" = N'Oracle') "t"
WHERE (("b"."Name" = "t"."Title") AND ("b"."Name" = N'MyBlog'))
```
* The PL/SQL returned by ToQueryString() does not execute successfully if the input to the LINQ query contains a TimeSpan. This is because in PL/SQL, interval value with precision is not accepted. Consider this example, imagine an entity model with the following entity:
```csharp
public class Author
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTimeOffset Timeline { get; set; }
}
```
The following LINQ will not work:
```csharp
var timeSpan = new TimeSpan(1000);
var authorsInChigley1 = context.Authors.Where(e => e.Timeline > DateTimeOffset.Now - timeSpan).ToQueryString();
```
Following is the PL/SQL that gets generated.
```sql
DECLARE
    l_sql     varchar2(32767);
    l_cur     pls_integer;
    l_execute pls_integer;
BEGIN
    l_cur := dbms_sql.open_cursor;
    l_sql := 'SELECT "a"."Id", "a"."Name", "a"."Timeline"
        FROM "Authors" "a"
        WHERE "a"."Timeline" > (SYSDATE - :timeSpan_0)';
    dbms_sql.parse(l_cur, l_sql, dbms_sql.native);
    dbms_sql.bind_variable(l_cur, ':timeSpan_0', INTERVAL '0 0:0:0.0001000' DAY(8) TO SECOND(7));
    l_execute:= dbms_sql.execute(l_cur);
    dbms_sql.return_result(l_cur);
END;
```

####  Scaffolding
* ORA-50607 or similar error occurs when a table has multiple identity and/or sequence/trigger columns auto-generated. While scaffolding such a table, the .NET model generated contains the ValueGeneratedOnAdd fluent API for all the auto-generated columns. When executing a LINQ query on this table, an ORA-50607 or similar error is thrown that indicates only one identity column per table is allowed. As a workaround for column values generated by a sequence/trigger, replace the ValueGeneratedOnAdd() fluent API appended to the corresponding property/column with UseSequence(your sequence name). The sequence name is the Oracle database sequence name from which the column gets its value.
* Scaffolding a table that uses Function Based Indexes is supported. However, the index will NOT be scaffolded.
* Scaffolding a table that uses Conditional Indexes is not supported.

#### Sequences
* A sequence cannot be restarted.
* Extension methods related to SequenceHiLo is not supported, except for columns with Char, UInt, ULong, and UByte data types.

 Copyright (c) 2024, Oracle and/or its affiliates. 
