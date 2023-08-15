import CollectionDay from "./collectionDay";

export default interface PackageDay {
    availability_label?: string,
    availability_label_number?: number,
    isNew?: boolean,
    collection_day?: CollectionDay[],
    meals_left?: number,
    sold_out?: number
}