BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Greenhouses] (
    [GreenhouseID] INT NOT NULL IDENTITY(1,1),
    [OwnerID] INT,
    [GreenhouseName] NVARCHAR(150),
    [GreenhouseType] NVARCHAR(150),
    [AreaSqM] DECIMAL(10,2),
    [ConstructionDate] DATE,
    [CreatedAt] DATETIME2,
    [Address] NVARCHAR(250),
    [IsActive] BIT,
    [Notes] NVARCHAR(500),
    CONSTRAINT [PK_Greenhouses] PRIMARY KEY CLUSTERED ([GreenhouseID])
);

-- CreateTable
CREATE TABLE [dbo].[PlantGrowthStages] (
    [StageID] INT NOT NULL IDENTITY(1,1),
    [VarietyID] INT,
    [StageOrder] INT,
    [StageName] NVARCHAR(100),
    [EntryCriteria] NVARCHAR(100),
    [StartDay] INT,
    [ExitCriteria] NVARCHAR(100),
    [EndDay] INT,
    [Description] NVARCHAR(500),
    CONSTRAINT [PK_PlantGrowthStages] PRIMARY KEY CLUSTERED ([StageID])
);

-- CreateTable
CREATE TABLE [dbo].[Plantings] (
    [PlantingID] BIGINT NOT NULL IDENTITY(1,1),
    [GreenhouseID] INT,
    [ZoneID] INT,
    [VarietyID] INT,
    [PlantDate] DATE,
    [SourceBatch] NVARCHAR(200),
    [NumPlants] INT,
    [PlantsPerM2] DECIMAL(9,3),
    [ExpectedHarvestDate] DATE,
    [ActualHarvestDate] DATE,
    [SeedingMethod] NVARCHAR(100),
    [TransplantDate] DATE,
    [PlantCountMeasured] INT,
    [Notes] NVARCHAR(500),
    CONSTRAINT [PK_Plantings] PRIMARY KEY CLUSTERED ([PlantingID])
);

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagr__C2B05B616C7FF742] PRIMARY KEY CLUSTERED ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id],[name])
);

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [UserID] INT NOT NULL IDENTITY(1,1),
    [Username] NVARCHAR(100) NOT NULL,
    [PasswordHash] NVARCHAR(256) NOT NULL,
    [FullName] NVARCHAR(150),
    [Email] NVARCHAR(200),
    [Phone] NVARCHAR(50),
    [RoleID] INT,
    [IsActive] BIT,
    [CreatedAt] DATETIME2,
    [LastLoginAt] DATETIME2,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([UserID]),
    CONSTRAINT [Users_Username_key] UNIQUE NONCLUSTERED ([Username]),
    CONSTRAINT [Users_Email_key] UNIQUE NONCLUSTERED ([Email])
);

-- CreateTable
CREATE TABLE [dbo].[Session] (
    [ID] NVARCHAR(100) NOT NULL,
    [PublicID] NVARCHAR(100) NOT NULL,
    [SecretHash] NVARCHAR(1000) NOT NULL,
    [UserId] INT,
    [CreatedAt] DATETIME2,
    [ExpiresAt] DATETIME2,
    [LastUsedAt] DATETIME2,
    CONSTRAINT [PK_Session] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [UQ_Session_PublicID] UNIQUE NONCLUSTERED ([PublicID])
);

-- CreateTable
CREATE TABLE [dbo].[Zones] (
    [ZoneID] INT NOT NULL IDENTITY(1,1),
    [GreenhouseID] INT,
    [Name] NVARCHAR(100),
    [AreaSqM] DECIMAL(9,2),
    [MicroclimateNotes] NVARCHAR(500),
    CONSTRAINT [PK_Zones] PRIMARY KEY CLUSTERED ([ZoneID])
);

-- CreateTable
CREATE TABLE [dbo].[Owner_Observer] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [FirstName] NVARCHAR(150),
    [LastName] NVARCHAR(150),
    [PhoneNumber] NVARCHAR(150),
    [Profesion] NVARCHAR(150),
    CONSTRAINT [PK_Owner_Observer] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[PlantingGrowthDaily] (
    [PlantGrowthDailyID] BIGINT NOT NULL IDENTITY(1,1),
    [ObserverID] INT,
    [PlantingID] BIGINT,
    [StageID] INT,
    [RecordDate] DATE,
    [HeightCm] DECIMAL(9,3),
    [LeafCount] INT,
    [FlowerCount] INT,
    [FruitCount] INT,
    [RootLength] INT,
    [Rootdiameter] INT,
    [IsEstimated] BIT,
    [HealthScore] DECIMAL(5,2),
    [PestObserved] BIT,
    [Notes] NVARCHAR(500),
    CONSTRAINT [PK_PlantingGrowthDaily] PRIMARY KEY CLUSTERED ([PlantGrowthDailyID])
);

-- CreateTable
CREATE TABLE [dbo].[Plants] (
    [PlantID] INT NOT NULL IDENTITY(1,1),
    [CommonName] NVARCHAR(150),
    [ScientificName] NVARCHAR(250),
    [Family] NVARCHAR(150),
    [Notes] NVARCHAR(500),
    CONSTRAINT [PK_Plants] PRIMARY KEY CLUSTERED ([PlantID])
);

-- CreateTable
CREATE TABLE [dbo].[PlantVarities] (
    [VarietyID] INT NOT NULL IDENTITY(1,1),
    [PlantID] INT,
    [VarietyName] NVARCHAR(200),
    [SeedCompany] NVARCHAR(200),
    [DaysToGermination] INT,
    [DaysToSprout] INT,
    [DaysToSeedling] INT,
    [DaysToMaturity] INT,
    [TypicalYieldKgPerM2] DECIMAL(10,3),
    [IdealTempMin] DECIMAL(6,2),
    [IdealTempMax] DECIMAL(6,2),
    [IdealHumidityMin] DECIMAL(6,2),
    [IdealHumidityMax] DECIMAL(6,2),
    [LightRequirement] NVARCHAR(100),
    [GrowthCycleDays] INT,
    [Notes] NVARCHAR(500),
    CONSTRAINT [PK_PlantVarities] PRIMARY KEY CLUSTERED ([VarietyID])
);

-- AddForeignKey
ALTER TABLE [dbo].[Greenhouses] ADD CONSTRAINT [FK_Greenhouses_Owner_Observer] FOREIGN KEY ([OwnerID]) REFERENCES [dbo].[Owner_Observer]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PlantGrowthStages] ADD CONSTRAINT [FK_Stages_Varieties] FOREIGN KEY ([VarietyID]) REFERENCES [dbo].[PlantVarities]([VarietyID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Plantings] ADD CONSTRAINT [FK_Plantings_Varieties] FOREIGN KEY ([VarietyID]) REFERENCES [dbo].[PlantVarities]([VarietyID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Plantings] ADD CONSTRAINT [FK_Plantings_Zones] FOREIGN KEY ([ZoneID]) REFERENCES [dbo].[Zones]([ZoneID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Session] ADD CONSTRAINT [FK_Session_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([UserID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Zones] ADD CONSTRAINT [FK_Zones_Greenhouses] FOREIGN KEY ([GreenhouseID]) REFERENCES [dbo].[Greenhouses]([GreenhouseID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PlantingGrowthDaily] ADD CONSTRAINT [FK_PlantingGrowthDaily_Owner_Observer] FOREIGN KEY ([ObserverID]) REFERENCES [dbo].[Owner_Observer]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PlantingGrowthDaily] ADD CONSTRAINT [FK_PlantingGrowthDaily_PlantGrowthStages] FOREIGN KEY ([StageID]) REFERENCES [dbo].[PlantGrowthStages]([StageID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PlantingGrowthDaily] ADD CONSTRAINT [FK_PlantingGrowthDaily_Plantings] FOREIGN KEY ([PlantingID]) REFERENCES [dbo].[Plantings]([PlantingID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PlantVarities] ADD CONSTRAINT [FK_PlantVarities_Plants] FOREIGN KEY ([PlantID]) REFERENCES [dbo].[Plants]([PlantID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
