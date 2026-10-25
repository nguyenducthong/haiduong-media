import Link from "@/components/link";
import { Calendar, MapPin, ArrowRight, Sparkles, Clock } from "lucide-react";
import type { EventItem } from "@/lib/site-content";

export function HomeEventsSection({
  events,
  eyebrow,
  title,
  description,
  viewAllText,
}: {
  events: EventItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
  viewAllText?: string;
}) {
  const visibleEvents = (events || []).filter((e) => e.active !== false);
  if (!visibleEvents.length) return null;

  return (
    <section className="section events-section" id="upcoming-events">
      <div className="site-container">
        <div className="section-heading split-heading">
          <div>
            <span className="eyebrow" style={{ color: "#d42027" }}>
              {eyebrow || "LỊCH TRÌNH SỰ KIỆN 2026 – 2027"}
            </span>
            <h2>{title || "Sự Kiện Sắp Diễn Ra"}</h2>
          </div>
          <div>
            <p style={{ marginBottom: "8px" }}>
              {description ||
                "Các diễn đàn kinh tế, chương trình tôn vinh thương hiệu uy tín và sự kiện xúc tiến thương mại quốc tế được phối hợp và đồng hành tổ chức tại Việt Nam và các nước Châu Á."}
            </p>
            <Link
              href="/su-kien"
              className="text-link"
              style={{ fontWeight: 800, color: "#d42027", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              {(viewAllText || "Xem tất cả sự kiện")} ({visibleEvents.length}) <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="events-grid">
          {visibleEvents.map((event, index) => {
            const eventUrl = `/su-kien/${event.slug}`;
            return (
              <article className="event-card has-poster" key={event.id || index}>
                {/* Poster Image */}
                <Link href={eventUrl} className="event-poster-wrapper" aria-label={event.title}>
                  <img
                    src={event.image || "/images/events/event-korea.png"}
                    alt={event.title}
                    className="event-poster-img"
                    loading="lazy"
                  />
                  <div className="event-poster-overlay">
                    <span className="event-tag">{event.tag || "Sự kiện"}</span>
                  </div>
                </Link>

                {/* Event Body */}
                <div className="event-card-body">
                  <h3 className="event-card-title">
                    <Link href={eventUrl}>{event.title}</Link>
                  </h3>

                  <div className="event-info-list">
                    <div className="event-info-item">
                      <Calendar size={15} className="event-icon" />
                      <span>{event.time || event.date}</span>
                    </div>
                    {event.location && (
                      <div className="event-info-item">
                        <MapPin size={15} className="event-icon" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="event-card-action">
                    <Link href={eventUrl} className="event-btn">
                      Xem chi tiết sự kiện <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
