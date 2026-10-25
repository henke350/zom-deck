import { useEffect, useRef } from 'react'
import type { Balance } from '../../data/balance'
import { texts } from '../../data/texts.en'
import { lockerChoices, upgradeIds, validateBuild } from '../../game'
import type { CampaignState, CardId } from '../../game'
import type { UpgradeId } from '../../data/balance'
import { cardText } from '../names'
import { Page } from './Page'

interface BaseScreenProps {
  readonly campaign: CampaignState
  readonly balance: Balance
  readonly onBuild: (id: UpgradeId) => void
  readonly onLocker: (card: CardId | undefined) => void
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
              : ''}
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
            <li className="muted">{t.lossesLeft(c.lossesAllowed - campaign.losses)}</li>
          </ul>
        </section>
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
