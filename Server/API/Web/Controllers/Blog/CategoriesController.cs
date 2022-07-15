namespace Web.Controllers.Blog
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Authorization;

    using Shared;

    using Web.Extensions;

    using Application.Handlers.Category.Commands;
    using Application.Handlers.Category.Queries;

    using Models.Blog;

    public class CategoriesController : ApiController
    {
        [HttpGet]
        [ProducesResponseType(typeof(Result<IReadOnlyList<CategoryDto>>), StatusCodes.Status200OK)]
        public async Task<ActionResult<Result<IReadOnlyList<CategoryDto>>>> GetAll()
        {
            return await Mediator.Send(new GetAllCategoriesQuery()).ToActionResult();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Result<CategoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Result<CategoryDto>>> GetById(string id)
        {
            return await Mediator.Send(new GetCategoryByIdQuery(id)).ToActionResult();
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(typeof(Result<CategoryDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Result<CategoryDto>>> Create([FromBody] CreateCategoryCommand command)
        {
            return await Mediator.Send(command).ToActionResult();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Result<bool>>> Update(string id, [FromBody] UpdateCategoryCommand command)
        {
            if (id != command.CategoryId)
            {
                return BadRequest(Result<bool>.Failure(new List<string> { "Category ID mismatch." }));
            }
            return await Mediator.Send(command).ToActionResult();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Result<bool>>> Delete(string id)
        {
            return await Mediator.Send(new DeleteCategoryCommand(id)).ToActionResult();
        }
    }
}