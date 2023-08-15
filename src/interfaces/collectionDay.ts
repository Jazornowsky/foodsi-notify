export default interface CollectionDay {
    id: number;
    week_day?: number,
    schedule_id?: number,
    active?: boolean,
    closed_at?: string,
    opened_at?: string,
}