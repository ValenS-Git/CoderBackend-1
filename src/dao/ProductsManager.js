import Product from './models/Product.js'; 

class ProductsManager {
  constructor() {}

  async getAllProducts({ limit = 10, page = 1, query = {}, sort = '' }) {
    try {
      const filter = query.category ? { category: query.category } : query; 
      const sortOptions = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}; 

      const options = {
        page,
        limit,
        sort: sortOptions
      };

      const result = await Product.paginate(filter, options);

      return {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevPage ? `/api/products?page=${result.prevPage}` : null,
        nextLink: result.nextPage ? `/api/products?page=${result.nextPage}` : null
      };
    } catch (error) {
      console.error(error);
      return { status: 'error', message: error.message };
    }
  }

  async getProductById(pid) {
    try {
      const product = await Product.findById(pid);
      if (!product) {
        return { status: 'error', message: 'Product not found' };
      }
      return { status: 'success', payload: product };
    } catch (error) {
      console.error(error);
      return { status: 'error', message: error.message };
    }
  }
}

export default ProductsManager;

