from tools import get_transactions
async def get_data():
    data=await get_transactions()
    return data