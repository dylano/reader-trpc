ALTER TABLE "cats" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "cats" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cats" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cats" ALTER COLUMN "age" SET NOT NULL;