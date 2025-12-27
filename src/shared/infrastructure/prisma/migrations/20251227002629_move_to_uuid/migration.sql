-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "encarte_estabelecimentos" (
    "encarte_id" TEXT NOT NULL,
    "estabelecimento_id" TEXT NOT NULL,

    CONSTRAINT "encarte_estabelecimentos_pkey" PRIMARY KEY ("encarte_id","estabelecimento_id")
);

-- CreateTable
CREATE TABLE "encartes" (
    "id" TEXT NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "data_validade" DATE,
    "imagem_capa_url" VARCHAR(500),
    "localidade_id" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "encartes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "especialidades" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "estabelecimento_id" TEXT,

    CONSTRAINT "especialidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estabelecimentos" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "logo_url" VARCHAR(500),
    "endereco" VARCHAR(500),
    "telefone" VARCHAR(50),
    "whatsapp" VARCHAR(50),
    "avaliacao_media" DECIMAL(3,2) DEFAULT 0.00,
    "total_avaliacoes" INTEGER DEFAULT 0,
    "localidade_id" TEXT,
    "segmento_id" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estabelecimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localidades" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "localidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redes_sociais" (
    "id" TEXT NOT NULL,
    "plataforma" VARCHAR(50) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "estabelecimento_id" TEXT,

    CONSTRAINT "redes_sociais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schema_migrations" (
    "version" BIGINT NOT NULL,
    "dirty" BOOLEAN NOT NULL,

    CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version")
);

-- CreateTable
CREATE TABLE "segmentos" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "icone_url" VARCHAR(500),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "segmentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_encartes_localidade" ON "encartes"("localidade_id");

-- CreateIndex
CREATE INDEX "idx_estabelecimentos_localidade" ON "estabelecimentos"("localidade_id");

-- CreateIndex
CREATE INDEX "idx_estabelecimentos_segmento" ON "estabelecimentos"("segmento_id");

-- AddForeignKey
ALTER TABLE "encarte_estabelecimentos" ADD CONSTRAINT "encarte_estabelecimentos_encarte_id_fkey" FOREIGN KEY ("encarte_id") REFERENCES "encartes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "encarte_estabelecimentos" ADD CONSTRAINT "encarte_estabelecimentos_estabelecimento_id_fkey" FOREIGN KEY ("estabelecimento_id") REFERENCES "estabelecimentos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "encartes" ADD CONSTRAINT "encartes_localidade_id_fkey" FOREIGN KEY ("localidade_id") REFERENCES "localidades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "especialidades" ADD CONSTRAINT "especialidades_estabelecimento_id_fkey" FOREIGN KEY ("estabelecimento_id") REFERENCES "estabelecimentos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "estabelecimentos" ADD CONSTRAINT "estabelecimentos_localidade_id_fkey" FOREIGN KEY ("localidade_id") REFERENCES "localidades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "estabelecimentos" ADD CONSTRAINT "estabelecimentos_segmento_id_fkey" FOREIGN KEY ("segmento_id") REFERENCES "segmentos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "redes_sociais" ADD CONSTRAINT "redes_sociais_estabelecimento_id_fkey" FOREIGN KEY ("estabelecimento_id") REFERENCES "estabelecimentos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
