import Image from "next/image"

export default function NoDataPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative h-24 w-24">
        <Image src="/placeholder.svg" alt="No data" fill className="object-contain" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No Data Available</h3>
      <p className="text-sm text-muted-foreground">There is no data to show you right now.</p>
    </div>
  )
}

