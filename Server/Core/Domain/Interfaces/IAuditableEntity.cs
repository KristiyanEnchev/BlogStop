﻿namespace Domain.Interfaces
{
    public interface IAuditableEntity
    {
        string? CreatedBy { get; set; }
        DateTimeOffset? CreatedDate { get; set; }
        string? UpdatedBy { get; set; }
        DateTimeOffset? UpdatedDate { get; set; }
    }
}