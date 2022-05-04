/****** Object:  Table [dbo].[Customers]    Script Date: 5/4/2022 6:45:40 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [varchar](100) NOT NULL,
	[LastName] [varchar](100) NOT NULL,
	[PhoneNumber] [varchar](100) NOT NULL,
	[TotalBoxes] [int] NOT NULL,
 CONSTRAINT [PK_Customers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Facilities]    Script Date: 5/4/2022 6:45:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Facilities](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[SmallCount] [int] NOT NULL,
	[MediumCount] [int] NOT NULL,
	[LargeCount] [int] NOT NULL,
	[SmallMaxCount] [int] NOT NULL,
	[MediumMaxCount] [int] NOT NULL,
	[LargeMaxCount] [int] NOT NULL,
 CONSTRAINT [PK_Facilities] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CustomerBoxes]    Script Date: 5/4/2022 6:45:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CustomerBoxes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CustomerId] [int] NOT NULL,
	[FacilityId] [int] NOT NULL,
	[BoxType] [smallint] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[Notes] [varchar](300) NOT NULL,
	[StorageStatus] [smallint] NOT NULL,
 CONSTRAINT [PK_CustomerBoxes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[CustomerBoxes_Details]    Script Date: 5/4/2022 6:45:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[CustomerBoxes_Details]

AS
--sp_refreshview CustomerBoxes_Details

SELECT 
	CustomerBoxes.Id, 
	CustomerBoxes.BoxType, 
	CustomerBoxes.CreatedDate , 
	CustomerBoxes.Notes , 
	StorageStatus,
	Customers.FirstName as CustomerFirstName, 
	Customers.LastName as CustomerLastName, 
	Customers.PhoneNumber as CustomerPhoneNumber, 
	Facilities.[Name] as FacilityName,

	Facilities.Id as FacilityId,
	Customers.Id as CustomerId
FROM CustomerBoxes
LEFT JOIN Customers ON 
CustomerBoxes.CustomerId = Customers.Id
LEFT JOIN Facilities ON 
CustomerBoxes.FacilityId = Facilities.Id
GO
ALTER TABLE [dbo].[CustomerBoxes] ADD  CONSTRAINT [DF_CustomerBoxes_Note]  DEFAULT ('') FOR [Notes]
GO
ALTER TABLE [dbo].[CustomerBoxes] ADD  CONSTRAINT [DF_CustomerBoxes_StorageStatus]  DEFAULT ((1)) FOR [StorageStatus]
GO
ALTER TABLE [dbo].[Customers] ADD  CONSTRAINT [DF_Customers_TotalBoxes]  DEFAULT ((0)) FOR [TotalBoxes]
GO
ALTER TABLE [dbo].[Facilities] ADD  CONSTRAINT [DF_Facilities_SmallMaxCount]  DEFAULT ((0)) FOR [SmallMaxCount]
GO
ALTER TABLE [dbo].[Facilities] ADD  CONSTRAINT [DF_Facilities_MediumMaxCount]  DEFAULT ((0)) FOR [MediumMaxCount]
GO
ALTER TABLE [dbo].[Facilities] ADD  CONSTRAINT [DF_Facilities_LargeMaxCount]  DEFAULT ((0)) FOR [LargeMaxCount]
GO
/****** Object:  StoredProcedure [dbo].[Customer_Delete]    Script Date: 5/4/2022 6:45:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


create procedure [dbo].[Customer_Delete]
	@Id as int 

AS


DELETE FROM Customers WHERE Id = @Id
GO
/****** Object:  StoredProcedure [dbo].[CustomerBoxes_Details_Get]    Script Date: 5/4/2022 6:45:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[CustomerBoxes_Details_Get]
	@CustomerId as int = -1
	,@FacilityId as int = -1
	,@BoxType as smallint = -1
	,@Notes as varchar(300) = ''
AS


SELECT 

	Id, 
	BoxType, 
	CONVERT(varchar,CreatedDate ,101) as CreatedDate ,  
	Notes , 
	CustomerFirstName, 
	CustomerLastName, 
	CustomerPhoneNumber, 
	FacilityName,

	FacilityId,
	CustomerId,
	StorageStatus

FROM CustomerBoxes_Details  
WHERE 
	FacilityId = (case when @FacilityId = -1 then FacilityId else @FacilityId end)
AND
	CustomerId = (case when @CustomerId = -1 then CustomerId else @CustomerId end)
AND
	BoxType = (case when @BoxType = -1 then BoxType else @BoxType end)

AND
	Notes like (case when @Notes = '' then Notes else '%' + @Notes + '%' end)
	ORDER BY CreatedDate DESC
GO
/****** Object:  StoredProcedure [dbo].[CustomerBoxes_RetrievePackage]    Script Date: 5/4/2022 6:45:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[CustomerBoxes_RetrievePackage]
	@Id int
	,@CustomerId as int = -1
	,@FacilityId as int = -1
	,@BoxType as smallint = -1
AS


UPDATE [CustomerBoxes] 
SET
	StorageStatus = 0
WHERE Id = @Id


	DECLARE @TotalBoxInStorage int = (SELECT COUNT(1) FROM [CustomerBoxes] WHERE FacilityId = @FacilityId AND BoxType = @BoxType AND [StorageStatus] = 1 )
			,@UpdateColumnName varchar(20) = (CASE WHEN @BoxType = 1 THEN 'SmallCount' WHEN @BoxType = 2 THEN 'MediumCount' ELSE 'LargeCount' END)  

	DECLARE @SQL VARCHAR(MAX)
	SET @SQL = 
	'UPDATE [dbo].[Facilities]
		SET ' + @UpdateColumnName + ' = ' + CONVERT(varchar, @TotalBoxInStorage)
	+ ' WHERE  Id = ' + CONVERT(varchar, @FacilityId)
	
	EXEC (@SQL)
	
	UPDATE Customers
	SET
		TotalBoxes = (SELECT COUNT(1) FROM [CustomerBoxes] WHERE CustomerId = @CustomerId AND [StorageStatus] = 1)
	WHERE Id = @CustomerId


		   
GO
/****** Object:  StoredProcedure [dbo].[CustomerBoxes_StorePackage]    Script Date: 5/4/2022 6:45:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--exec CustomerBoxes_StorePackage 1,2,1
CREATE PROCEDURE [dbo].[CustomerBoxes_StorePackage]

	@CustomerId int
	,@FacilityId int
	,@BoxType smallint
	,@Notes varchar(300)

AS



IF EXISTS(SELECT 1 FROM Facilities WHERE (CASE WHEN @BoxType = 1 THEN SmallCount WHEN @BoxType = 2 THEN MediumCount WHEN @BoxType = 3 THEN LargeCount END) 
		
		< (CASE WHEN @BoxType = 1 THEN SmallMaxCount WHEN @BoxType = 2 THEN MediumMaxCount WHEN @BoxType = 3 THEN LargeMaxCount END)  
		
		AND Id = @FacilityId) BEGIN

	INSERT INTO [dbo].[CustomerBoxes]
           ([CustomerId]
           ,[FacilityId]
           ,[BoxType]
           ,[CreatedDate]
		   ,[Notes]
		   ,[StorageStatus])
     VALUES
           (@CustomerId
           ,@FacilityId
           ,@BoxType
           ,GETDATE()
		   ,@Notes
		   ,1)
	

	DECLARE @TotalBoxInStorage int = (SELECT COUNT(1) FROM [CustomerBoxes] WHERE FacilityId = @FacilityId AND BoxType = @BoxType AND [StorageStatus] = 1 )
			,@UpdateColumnName varchar(20) = (CASE WHEN @BoxType = 1 THEN 'SmallCount' WHEN @BoxType = 2 THEN 'MediumCount' ELSE 'LargeCount' END)  

	DECLARE @SQL VARCHAR(MAX)
	SET @SQL = 
	'UPDATE [dbo].[Facilities]
		SET ' + @UpdateColumnName + ' = ' + CONVERT(varchar, @TotalBoxInStorage)
	+ ' WHERE  Id = ' + CONVERT(varchar, @FacilityId)

	UPDATE Customers
	SET
		TotalBoxes = (SELECT COUNT(1) FROM [CustomerBoxes] WHERE CustomerId = @CustomerId AND [StorageStatus] = 1)
	WHERE Id = @CustomerId


	EXEC (@SQL)
	PRINT @SQL
END 


		   
GO
