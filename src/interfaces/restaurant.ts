import Meal from "./meal";
import PackageDay from "./package";

export default interface Restaurant {
    id: number,
    name: string,
    address?: string,
    address_notes?: string,
    distance?: string,
    image?: {
        url?: string,
    },
    important_notes?: string,
    latitude?: string,
    longitude?: string,
    logo?: {
        url?: string,
    },
    meal?: Meal,
    package_day: PackageDay,
    package_id: number,
    package_type: string,
    phone: string,
    url: string,
    what_you_need_to_know: string
}