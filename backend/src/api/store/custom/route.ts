import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

import { ModuleRegistrationName } from "@medusajs/utils"
import { IProductModuleService } from "@medusajs/types"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const tagsParam = req.query.tags
    let tags: string[] = []
    if (typeof tagsParam === "string") {
      tags = tagsParam.split(",").map((t) => t.trim()).filter(Boolean)
    } else if (Array.isArray(tagsParam)) {
      tags = tagsParam.flatMap((v) => v.split(",")).map((t) => t.trim()).filter(Boolean)
    }

    // get product module/service from DI container
    const productService: IProductModuleService = req.scope.resolve(ModuleRegistrationName.PRODUCT)

    // build filter
    const filter: any = {}
    if (tags.length > 0) {
      // Medusa products have a tags relation with value field
      filter["tags.value"] = tags
    }

    // fetch products (any tag match)
    const [products, count] = await productService.listAndCount(filter, req.listConfig)

    res.status(200).json({ count, products })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products by tags", error: err?.message || err })
  }
}


