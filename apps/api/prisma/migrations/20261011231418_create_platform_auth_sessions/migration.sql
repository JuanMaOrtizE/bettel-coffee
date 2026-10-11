-- CreateTable
CREATE TABLE "platform_auth_sessions" (
    "id" UUID NOT NULL,
    "platform_admin_id" UUID NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "revoked_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "platform_auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "platform_auth_sessions_platform_admin_id_idx" ON "platform_auth_sessions"("platform_admin_id");

-- CreateIndex
CREATE INDEX "platform_auth_sessions_expires_at_idx" ON "platform_auth_sessions"("expires_at");

-- AddForeignKey
ALTER TABLE "platform_auth_sessions" ADD CONSTRAINT "platform_auth_sessions_platform_admin_id_fkey" FOREIGN KEY ("platform_admin_id") REFERENCES "platform_admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
