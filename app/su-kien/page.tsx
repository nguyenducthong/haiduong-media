import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { FloatingContact, PageHero, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { loadSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function EventsIndexPage() {
  const content = await loadSiteContent();

  return (
    <>
      <SiteHeader content={content} />
      <main>
        <PageHero
          eyebrow="LỊCH TRÌNH 2026 - 2027"
          title="Sự Kiện & Diễn Đàn Doanh Nhân"
          description="Khám phá các chương trình vinh danh thương hiệu uy tín, diễn đàn kinh tế và sự kiện xúc tiến thương mại quốc tế do Hải Dương Media đồng hành tổ chức."
        />

        <section className="section events-page-section">
          <div className="site-container">
            <div className="events-grid">
              {content.upcomingEvents
                .filter((e) => e.active !== false)
                .map((event, index) => {
                  const eventUrl = `/su-kien/${event.slug}`;
                return (
                  <article className="event-card has-poster" key={event.id || index}>
                    <Link href={eventUrl} className="event-poster-wrapper" aria-label={event.title}>
                      <img
                        src={event.image}
                        alt={event.title}
                        className="event-poster-img"
                        loading="lazy"
                      />
                      <div className="event-poster-overlay">
                        <span className="event-tag">{event.tag}</span>
                      </div>
                    </Link>

                    <div className="event-card-body">
                      <h3 className="event-card-title">
                        <Link href={eventUrl}>{event.title}</Link>
                      </h3>

                      <div className="event-info-list">
                        <div className="event-info-item">
                          <Calendar size={15} className="event-icon" />
                          <span>{event.date}</span>
                        </div>
                        <div className="event-info-item">
                          <MapPin size={15} className="event-icon" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <p className="event-excerpt-text">{event.summary}</p>

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
      </main>
      <SiteFooter content={content} />
      <FloatingContact content={content} />
    </>
  );
}
