import { useEffect, useRef } from 'react'
import type { Balance } from '../../data/balance'
import { texts } from '../../data/texts.en'
import {
  alliesOf,
  dayMission,
  lockerChoices,
  upgradeIds,
  validateBuild,
  validateToggleAlly,
} from '../../game'
import type { CampaignState, CardId, DayReport } from '../../game'
import type { AllyJob, UpgradeId } from '../../data/balance'
import { cardText, locationText } from '../names'
import { Page } from './Page'

interface BaseScreenProps {
  readonly campaign: CampaignState
  readonly balance: Balance
  readonly onBuild: (id: UpgradeId) => void
  readonly onLocker: (card: CardId | undefined) => void
  /** Take an ally along today, or leave them home. */
  readonly onToggleAlly: (uid: string) => void
  readonly onSetOut: () => void
  readonly onNewCampaign: () => void
  readonly onExit: () => void
}

/**
 * The base between campaign days: what last night brought, how you start today, and what you
 * can build. A page of its own, like the rules, never a pop-up over the city.
 */
export function BaseScreen({
  campaign,
  balance,
  onBuild,
  onLocker,
  onToggleAlly,
  onSetOut,
  onNewCampaign,
  onExit,
}: BaseScreenProps) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])
  const t = texts.campaign
  const c = balance.campaign
  const last = campaign.history.at(-1)
  const choices = lockerChoices(campaign)
  const mission = dayMission(campaign, balance)

  return (
    <Page labelledBy="base-title">
      <h2 id="base-title" ref={heading} tabIndex={-1}>
        {campaign.over === 'survived'
          ? t.survived(c.days)
          : campaign.over === 'lost'
            ? t.lostCampaign
            : t.dayHeading(campaign.day, c.days)}
      </h2>
      <p className="muted">
        {campaign.over
          ? t.overSummary(
              campaign.history.filter((d) => d.outcome.result === 'won').length,
              campaign.food,
              campaign.water,
              campaign.upgrades.length,
            )
          : t.intro}
      </p>

      <ul className="base-stock" aria-label={t.stockLabel}>
        <li>
          <b>{campaign.food}</b> {t.stock.food}
        </li>
        <li>
          <b>{campaign.water}</b> {t.stock.water}
        </li>
        <li>
          <b>{campaign.materials}</b> {t.stock.materials}
        </li>
      </ul>

      {last && (
        <section aria-labelledby="base-last">
          <h3 id="base-last">{t.yesterdayHeading}</h3>
          <p>
            {last.outcome.result === 'won'
              ? t.cameHome(last.day, last.food, last.water, last.materials)
              : t.lostDay(last.day)}{' '}
            {last.ate ? t.ate : t.hungry} {last.drank ? t.drank : t.thirsty}{' '}
            {last.producedFood + last.producedWater > 0
              ? t.produced(last.producedFood, last.producedWater)
              : ''}{' '}
            {last.dog ? t.dogNews[last.dog] : ''}{' '}
            {last.mission
              ? texts.missions.report(
                  texts.missions[last.mission].name,
                  texts.missions.reward(c.missionReward[last.mission]),
                )
              : ''}{' '}
            {allyReport(last, c)}
          </p>
        </section>
      )}

      {!campaign.over && (
        <section aria-labelledby="base-today">
          <h3 id="base-today">{t.todayHeading}</h3>
          <ul>
            {campaign.hungry && <li>{t.penaltyHungry(c.hungerNerves)}</li>}
            {campaign.thirsty && <li>{t.penaltyThirsty(c.thirstHp)}</li>}
            {campaign.wounds > 0 && <li>{t.penaltyWounds(campaign.wounds)}</li>}
            {!campaign.hungry && !campaign.thirsty && campaign.wounds === 0 && (
              <li>{t.noPenalty}</li>
            )}
            {mission && (
              <li>
                <strong>
                  {texts.missions.label}: {texts.missions[mission.kind].name}.
                </strong>{' '}
                {texts.missions[mission.kind].text(locationText(mission.target).name)}{' '}
                {texts.missions.rewardLine(texts.missions.reward(c.missionReward[mission.kind]))}
              </li>
            )}
            {campaign.dog && (
              <li>{t.dogAtBase(campaign.dog.hp, balance.dog.hp, balance.dog.foodEvery)}</li>
            )}
            <li className="muted">{t.lossesLeft(c.lossesAllowed - campaign.losses)}</li>
          </ul>
        </section>
      )}

      {!campaign.over && (
        <AlliesSection campaign={campaign} balance={balance} onToggle={onToggleAlly} />
      )}

      {choices.length > 0 && (
        <section aria-labelledby="base-locker">
          <h3 id="base-locker">{t.lockerHeading}</h3>
          <div className="base-locker">
            {choices.map((card) => (
              <button
                key={card}
                type="button"
                className={`btn${campaign.locker === card ? ' btn-primary' : ''}`}
                aria-pressed={campaign.locker === card}
                onClick={() => onLocker(card)}
              >
                {cardText(card).name}
              </button>
            ))}
            <button
              type="button"
              className="btn btn-quiet"
              aria-pressed={campaign.locker === undefined}
              onClick={() => onLocker(undefined)}
            >
              {t.keepNone}
            </button>
          </div>
        </section>
      )}

      <section aria-labelledby="base-build">
        <h3 id="base-build">{t.baseHeading}</h3>
        <ul className="base-upgrades">
          {upgradeIds.map((id) => {
            const built = campaign.upgrades.includes(id)
            const check = validateBuild(campaign, id, balance)
            const upgrade = t.upgrades[id]
            return (
              <li key={id} className={built ? 'upgrade upgrade-built' : 'upgrade'}>
                <div>
                  <b>{upgrade.name}</b>
                  <span>{upgrade.text}</span>
                </div>
                {built ? (
                  <span className="upgrade-done">{t.built}</span>
                ) : (
                  <div className="upgrade-action">
                    <button
                      type="button"
                      className="btn"
                      aria-label={`${upgrade.name}: ${t.build(c.upgradeCost[id])}`}
                      disabled={!check.ok}
                      onClick={() => onBuild(id)}
                    >
                      {t.build(c.upgradeCost[id])}
                    </button>
                    {!check.ok && !campaign.over && <span className="reason">{check.reason}</span>}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <div className="page-actions">
        {campaign.over ? (
          <button type="button" className="btn btn-primary" onClick={onNewCampaign}>
            {t.restart}
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={onSetOut}>
            {t.setOut(campaign.day)}
          </button>
        )}
        <button type="button" className="btn btn-quiet" onClick={onExit}>
          {t.backToTitle}
        </button>
      </div>
    </Page>
  )
}

const names = (cards: readonly CardId[]) => cards.map((card) => cardText(card).name).join(', ')

/** Yesterday's news about the allies: who joined, got hurt, was lost or left; jobs and raids. */
function allyReport(day: DayReport, c: Balance['campaign']): string {
  const n = texts.allies.news
  const a = day.allies
  return [
    a && a.joined.length > 0 ? n.joined(names(a.joined)) : '',
    a && a.wounded.length > 0 ? n.wounded(names(a.wounded)) : '',
    a && a.died.length > 0 ? n.died(names(a.died)) : '',
    a && a.left.length > 0 ? n.left(names(a.left)) : '',
    day.allyFood ? n.food(day.allyFood) : '',
    day.allyMaterials ? n.materials(day.allyMaterials) : '',
    day.raid === 'raided' ? n.raided(c.allies.raid.food, c.allies.raid.water) : '',
    day.raid === 'stopped' ? n.stopped : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function jobText(job: AllyJob | undefined): string {
  const j = texts.allies.jobs
  switch (job?.kind) {
    case 'heal':
      return j.heal(job.hp, job.wounds)
    case 'guard':
      return j.guard
    case 'scout':
      return j.scout(job.buildings)
    case 'forage':
      return j.forage(job.food, job.every)
    case 'build':
      return j.build(job.materials)
    default:
      return ''
  }
}

/** The allies at the base: who goes out today and what the others do at home. */
function AlliesSection({
  campaign,
  balance,
  onToggle,
}: {
  campaign: CampaignState
  balance: Balance
  onToggle: (uid: string) => void
}) {
  const t = texts.allies
  const a = balance.campaign.allies
  const allies = alliesOf(campaign)
  return (
    <section aria-labelledby="base-allies">
      <h3 id="base-allies">{t.heading}</h3>
      <p className="muted">{allies.length > 0 ? t.intro(a.maxAlong, a.foodEvery) : t.none}</p>
      {allies.length > 0 && (
        <ul className="base-upgrades">
          {allies.map((ally) => {
            const name = cardText(ally.card).name
            const check = validateToggleAlly(campaign, ally.uid, balance)
            return (
              <li
                key={ally.uid}
                className={ally.going ? 'upgrade upgrade-built' : 'upgrade'}
                data-ally={ally.card}
              >
                <div>
                  <strong>{name}</strong>
                  <span>{ally.wounded ? t.resting : ally.going ? t.going : t.home}</span>
                  <span>{jobText(a.jobs[ally.card])}</span>
                </div>
                <div className="upgrade-action">
                  <button
                    type="button"
                    className={ally.going ? 'btn' : 'btn btn-primary'}
                    aria-label={ally.going ? t.leaveHome(name) : t.takeAlong(name)}
                    disabled={!check.ok}
                    title={check.ok ? undefined : check.reason}
                    onClick={() => onToggle(ally.uid)}
                  >
                    {ally.going ? t.leave : t.take}
                  </button>
                  {!check.ok && !ally.wounded && <span className="reason">{check.reason}</span>}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
