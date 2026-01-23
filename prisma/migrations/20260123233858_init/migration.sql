-- CreateTable
CREATE TABLE "v_xml_cdr" (
    "xml_cdr_uuid" TEXT NOT NULL,
    "start_stamp" TIMESTAMP(3) NOT NULL,
    "caller_id_number" TEXT NOT NULL,
    "destination_number" TEXT NOT NULL,
    "billsec" INTEGER NOT NULL,
    "hangup_cause" TEXT NOT NULL DEFAULT 'NORMAL_CLEARING',
    "record_path" TEXT NOT NULL,
    "record_name" TEXT NOT NULL,
    "domain_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "v_xml_cdr_pkey" PRIMARY KEY ("xml_cdr_uuid")
);
