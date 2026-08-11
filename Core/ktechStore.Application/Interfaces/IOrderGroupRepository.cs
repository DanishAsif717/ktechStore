using ktechStore.Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ktechStore.Application.Interfaces
{
    public interface IOrderGroupRepository
    {
        Task AddAsync(OrderGroup orderGroup);
        Task<OrderGroup?> GetByIdAsync(int id);
        Task UpdateAsync(OrderGroup orderGroup);
    }
}
