using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Persistence.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Blog");

            migrationBuilder.EnsureSchema(
                name: "Identity");

            migrationBuilder.CreateTable(
                name: "categories",
                schema: "Blog",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    slug = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: true),
                    created_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_categories", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "roles",
                schema: "Identity",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    normalized_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    concurrency_stamp = table.Column<string>(type: "text", nullable: true),
                    created_by = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    created_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "tags",
                schema: "Blog",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    slug = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: true),
                    created_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tags", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                schema: "Identity",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    first_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    last_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    refresh_token_expiry_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    user_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    normalized_user_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    normalized_email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    email_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: true),
                    security_stamp = table.Column<string>(type: "text", nullable: true),
                    concurrency_stamp = table.Column<string>(type: "text", nullable: true),
                    phone_number = table.Column<string>(type: "text", nullable: true),
                    phone_number_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    two_factor_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    lockout_end = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    lockout_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    access_failed_count = table.Column<int>(type: "integer", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: true),
                    created_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false),
                    deleted_by = table.Column<string>(type: "text", nullable: true),
                    deleted_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "role_claims",
                schema: "Identity",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    role_id = table.Column<string>(type: "text", nullable: false),
                    claim_type = table.Column<string>(type: "text", nullable: true),
                    claim_value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_role_claims", x => x.id);
                    table.ForeignKey(
                        name: "fk_role_claims_roles_role_id",
                        column: x => x.role_id,
                        principalSchema: "Identity",
                        principalTable: "roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "authors",
                schema: "Blog",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    bio = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    profile_image = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    created_by = table.Column<string>(type: "text", nullable: true),
                    created_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_authors", x => x.id);
                    table.ForeignKey(
                        name: "fk_authors_users_id",
                        column: x => x.id,
                        principalSchema: "Identity",
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "user_claims",
                schema: "Identity",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    claim_type = table.Column<string>(type: "text", nullable: true),
                    claim_value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_claims", x => x.id);
                    table.ForeignKey(
                        name: "fk_user_claims_users_user_id",
                        column: x => x.user_id,
                        principalSchema: "Identity",
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "user_logins",
                schema: "Identity",
                columns: table => new
                {
                    login_provider = table.Column<string>(type: "text", nullable: false),
                    provider_key = table.Column<string>(type: "text", nullable: false),
                    provider_display_name = table.Column<string>(type: "text", nullable: true),
                    user_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_logins", x => new { x.login_provider, x.provider_key });
                    table.ForeignKey(
                        name: "fk_user_logins_users_user_id",
                        column: x => x.user_id,
                        principalSchema: "Identity",
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "user_roles",
                schema: "Identity",
                columns: table => new
                {
                    user_id = table.Column<string>(type: "text", nullable: false),
                    role_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_roles", x => new { x.user_id, x.role_id });
                    table.ForeignKey(
                        name: "fk_user_roles_roles_role_id",
                        column: x => x.role_id,
                        principalSchema: "Identity",
                        principalTable: "roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_user_roles_users_user_id",
                        column: x => x.user_id,
                        principalSchema: "Identity",
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "user_tokens",
                schema: "Identity",
                columns: table => new
                {
                    user_id = table.Column<string>(type: "text", nullable: false),
                    login_provider = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_tokens", x => new { x.user_id, x.login_provider, x.name });
                    table.ForeignKey(
                        name: "fk_user_tokens_users_user_id",
                        column: x => x.user_id,
                        principalSchema: "Identity",
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "blog_posts",
                schema: "Blog",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    slug = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    excerpt = table.Column<string>(type: "text", nullable: false),
                    featured_image = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    is_featured = table.Column<bool>(type: "boolean", nullable: false),
                    is_published = table.Column<bool>(type: "boolean", nullable: false),
                    author_id = table.Column<string>(type: "text", nullable: false),
                    liked_by_user_ids = table.Column<List<string>>(type: "text[]", nullable: false),
                    view_count = table.Column<int>(type: "integer", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: true),
                    created_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_blog_posts", x => x.id);
                    table.ForeignKey(
                        name: "fk_blog_posts_authors_author_id",
                        column: x => x.author_id,
                        principalSchema: "Blog",
                        principalTable: "authors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "blog_post_categories",
                schema: "Blog",
                columns: table => new
                {
                    blog_posts_id = table.Column<string>(type: "text", nullable: false),
                    categories_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_blog_post_categories", x => new { x.blog_posts_id, x.categories_id });
                    table.ForeignKey(
                        name: "fk_blog_post_categories_blog_posts_blog_posts_id",
                        column: x => x.blog_posts_id,
                        principalSchema: "Blog",
                        principalTable: "blog_posts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_blog_post_categories_categories_categories_id",
                        column: x => x.categories_id,
                        principalSchema: "Blog",
                        principalTable: "categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "blog_post_tags",
                schema: "Blog",
                columns: table => new
                {
                    blog_posts_id = table.Column<string>(type: "text", nullable: false),
                    tags_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_blog_post_tags", x => new { x.blog_posts_id, x.tags_id });
                    table.ForeignKey(
                        name: "fk_blog_post_tags_blog_posts_blog_posts_id",
                        column: x => x.blog_posts_id,
                        principalSchema: "Blog",
                        principalTable: "blog_posts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_blog_post_tags_tags_tags_id",
                        column: x => x.tags_id,
                        principalSchema: "Blog",
                        principalTable: "tags",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "comments",
                schema: "Blog",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    content = table.Column<string>(type: "text", nullable: false),
                    is_approved = table.Column<bool>(type: "boolean", nullable: false),
                    blog_post_id = table.Column<string>(type: "text", nullable: false),
                    author_id = table.Column<string>(type: "text", nullable: false),
                    parent_comment_id = table.Column<string>(type: "text", nullable: true),
                    liked_by_user_ids = table.Column<List<string>>(type: "text[]", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: true),
                    created_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "text", nullable: true),
                    updated_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_comments", x => x.id);
                    table.ForeignKey(
                        name: "fk_comments_authors_author_id",
                        column: x => x.author_id,
                        principalSchema: "Blog",
                        principalTable: "authors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_comments_blog_posts_blog_post_id",
                        column: x => x.blog_post_id,
                        principalSchema: "Blog",
                        principalTable: "blog_posts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_comments_comments_parent_comment_id",
                        column: x => x.parent_comment_id,
                        principalSchema: "Blog",
                        principalTable: "comments",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "ix_blog_post_categories_categories_id",
                schema: "Blog",
                table: "blog_post_categories",
                column: "categories_id");

            migrationBuilder.CreateIndex(
                name: "ix_blog_post_tags_tags_id",
                schema: "Blog",
                table: "blog_post_tags",
                column: "tags_id");

            migrationBuilder.CreateIndex(
                name: "ix_blog_posts_author_id",
                schema: "Blog",
                table: "blog_posts",
                column: "author_id");

            migrationBuilder.CreateIndex(
                name: "ix_comments_author_id",
                schema: "Blog",
                table: "comments",
                column: "author_id");

            migrationBuilder.CreateIndex(
                name: "ix_comments_blog_post_id",
                schema: "Blog",
                table: "comments",
                column: "blog_post_id");

            migrationBuilder.CreateIndex(
                name: "ix_comments_parent_comment_id",
                schema: "Blog",
                table: "comments",
                column: "parent_comment_id");

            migrationBuilder.CreateIndex(
                name: "ix_role_claims_role_id",
                schema: "Identity",
                table: "role_claims",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "role_name_index",
                schema: "Identity",
                table: "roles",
                column: "normalized_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_user_claims_user_id",
                schema: "Identity",
                table: "user_claims",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_logins_user_id",
                schema: "Identity",
                table: "user_logins",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_roles_role_id",
                schema: "Identity",
                table: "user_roles",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "email_index",
                schema: "Identity",
                table: "users",
                column: "normalized_email");

            migrationBuilder.CreateIndex(
                name: "user_name_index",
                schema: "Identity",
                table: "users",
                column: "normalized_user_name",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "blog_post_categories",
                schema: "Blog");

            migrationBuilder.DropTable(
                name: "blog_post_tags",
                schema: "Blog");

            migrationBuilder.DropTable(
                name: "comments",
                schema: "Blog");

            migrationBuilder.DropTable(
                name: "role_claims",
                schema: "Identity");

            migrationBuilder.DropTable(
                name: "user_claims",
                schema: "Identity");

            migrationBuilder.DropTable(
                name: "user_logins",
                schema: "Identity");

            migrationBuilder.DropTable(
                name: "user_roles",
                schema: "Identity");

            migrationBuilder.DropTable(
                name: "user_tokens",
                schema: "Identity");

            migrationBuilder.DropTable(
                name: "categories",
                schema: "Blog");

            migrationBuilder.DropTable(
                name: "tags",
                schema: "Blog");

            migrationBuilder.DropTable(
                name: "blog_posts",
                schema: "Blog");

            migrationBuilder.DropTable(
                name: "roles",
                schema: "Identity");

            migrationBuilder.DropTable(
                name: "authors",
                schema: "Blog");

            migrationBuilder.DropTable(
                name: "users",
                schema: "Identity");
        }
    }
}
