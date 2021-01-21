-- SELECT * FROM [dbo].[DataSnapshots]
-- UPDATE [dbo].[DataSnapshots] SET SnapshotDate = DATEADD(YEAR, 1, SnapshotDate);
-- SELECT * FROM [dbo].[DataSnapshots] WHERE SnapshotDate = '2021-03-01 00:00:00.000'

--ALTER TABLE dbo.DataSnapshots ALTER COLUMN AcademyUpin integer NOT NULL 
--ALTER TABLE dbo.DataSnapshots ADD CONSTRAINT acUpin_def_val DEFAULT 0 FOR AcademyUpin
--Alter table dbo.DataSnapshots ADD CONSTRAINT comp_prim_key PRIMARY KEY (SnapshotDate, TrustUkprn, AcademyUpin, CoaAccount);
--exec sp_help  '[dbo].[DataSnapshots]'


--ALTER PROCEDURE sp_DataSnapshot_Upsert ( @SnapshotDate datetime, @TrustUkprn integer, @AcademyUpin integer, @CoaAccount integer, @CoaAccountValue decimal )
--AS 
--  BEGIN TRANSACTION;
 
--	INSERT dbo.DataSnapshots (SnapshotDate, TrustUkprn, AcademyUpin, CoaAccount, CoaAccountValue) 
--	VALUES (@SnapshotDate, @TrustUkprn, @AcademyUpin, @CoaAccount, @CoaAccountValue)

--	IF @@ROWCOUNT = 0
--	BEGIN
--	  UPDATE dbo.DataSnapshots 
--	  SET CoaAccountValue = @CoaAccountValue
--	  WHERE SnapshotDate = @SnapshotDate AND TrustUkprn = @TrustUkprn AND AcademyUpin = @AcademyUpin AND CoaAccount = @CoaAccount;
--	END
 
--  COMMIT TRANSACTION;


--ALTER PROCEDURE sp_DataSnapshot_Upsert ( @SnapshotDate datetime, @TrustUkprn integer, @AcademyUpin integer, @CoaAccount integer, @CoaAccountValue decimal )
--AS 
--  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
--  BEGIN TRAN
 
--    IF EXISTS ( SELECT * FROM dbo.DataSnapshots WITH (UPDLOCK) WHERE SnapshotDate = @SnapshotDate AND TrustUkprn = @TrustUkprn AND AcademyUpin = @AcademyUpin AND CoaAccount = @CoaAccount )
 
--	  UPDATE dbo.DataSnapshots 
--	  SET CoaAccountValue = @CoaAccountValue
--	  WHERE SnapshotDate = @SnapshotDate AND TrustUkprn = @TrustUkprn AND AcademyUpin = @AcademyUpin AND CoaAccount = @CoaAccount;
 
--    ELSE 
 
--	INSERT dbo.DataSnapshots (SnapshotDate, TrustUkprn, AcademyUpin, CoaAccount, CoaAccountValue) 
--	VALUES (@SnapshotDate, @TrustUkprn, @AcademyUpin, @CoaAccount, @CoaAccountValue)
 
--  COMMIT

SELECT * FROM [dbo].[DataSnapshots] WHERE TrustUkprn = 90000001

	INSERT dbo.DataSnapshots (SnapshotDate, TrustUkprn, AcademyUpin, CoaAccount, CoaAccountValue) 
	VALUES ('2021-11-01', 90000001, 100001, 845250, 99); 

	INSERT dbo.DataSnapshots (SnapshotDate, TrustUkprn, CoaAccount, CoaAccountValue) 
	VALUES ('2021-11-01', 90000001, 845250, 99); 

	EXEC sp_DataSnapshot_Upsert '2021-01-01', 90000001, 100001, 650400, 12
	EXEC sp_DataSnapshot_Upsert '2021-11-01', 90000001, 0, 845200, 55
	EXEC sp_DataSnapshot_Upsert '2021-11-01', 90000001, 100001, 845200, 44


	UPDATE dbo.DataSnapshots 
	SET CoaAccountValue = 22
	WHERE SnapshotDate = '2021-01-01' AND TrustUkprn = 90000001 AND AcademyUpin = 100001 AND CoaAccount = 650400;


	EXEC sp_DataSnapshot_Upsert '2021-01-01', 90000001, 100001, 650400, 44

	SELECT * FROM [dbo].[DataSnapshots] ORDER BY SnapshotDate ASC
	

	DELETE FROM [dbo].[DataSnapshots] WHERE SnapshotDate = '2021-09-01'

	EXEC sp_forecast
