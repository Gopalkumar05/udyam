-- CreateTable
CREATE TABLE "public"."Registration" (
    "id" SERIAL NOT NULL,
    "aadhaar" TEXT NOT NULL,
    "pan" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "gender" TEXT,
    "businessName" TEXT NOT NULL,
    "organizationType" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OtpRecord" (
    "id" SERIAL NOT NULL,
    "aadhaar" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Registration_aadhaar_key" ON "public"."Registration"("aadhaar");

-- CreateIndex
CREATE UNIQUE INDEX "OtpRecord_aadhaar_key" ON "public"."OtpRecord"("aadhaar");
