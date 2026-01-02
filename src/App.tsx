import { useMemo, useState, type ChangeEvent } from "react";
import "./App.css";

type DataCategory = {
  key: string;
  label: string;
  description: string;
};

const dataCategories: DataCategory[] = [
  {
    key: "personal",
    label: "Persoonsgegevens",
    description:
      "Namen, e-mailadressen, functietitels en andere directe identificatoren die je invoert bij registratie of support.",
  },
  {
    key: "account",
    label: "Accountgebruik",
    description:
      "Inloggegevens, profielvoorkeuren, abonnementen en instellingen die het platform personaliseren.",
  },
  {
    key: "financial",
    label: "Facturatie & betalingen",
    description:
      "Betaalkaartgegevens, facturen en betalingsbewijzen wanneer je upgrade of aankopen doet.",
  },
  {
    key: "behavioral",
    label: "Gedrag & analytics",
    description:
      "Paginaweergaves, klikken en trends die helpen de dienst betrouwbaar en relevant te houden.",
  },
  {
    key: "metadata",
    label: "Apparaat- & locatie metadata",
    description:
      "IP-adressen, browserinstellingen, apparaat-ID’s en een geschatte locatie voor veiligheid en monitoring.",
  },
  {
    key: "communications",
    label: "Communicatie",
    description:
      "Supporttickets, marketingtoestemmingen en directe gesprekken die ons helpen je beter te ondersteunen.",
  },
];

type FormData = {
  businessName: string;
  websiteUrl: string;
  contactEmail: string;
  contactPhone: string;
  policyEffectiveDate: string;
  dataPurposes: string;
  thirdPartyList: string;
  dataRetention: string;
  cookiesInfo: string;
};

type PolicySection = {
  title: string;
  paragraph?: string;
  list?: string[];
};

const today = new Date().toISOString().split("T")[0];

const defaultFormData: FormData = {
  businessName: "UpShift Privacy Lab",
  websiteUrl: "privacy-policy.upshift.be",
  contactEmail: "privacy@upshift.be",
  contactPhone: "+32 2 123 45 67",
  policyEffectiveDate: today,
  dataPurposes:
    "De dienst leveren, communicatie personaliseren, updates delen en de community veilig en compliant houden volgens AVG/GDPR.",
  thirdPartyList: "Stripe, Mollie, Plaid, Google Analytics, SendGrid",
  dataRetention:
    "We bewaren gegevens zolang nodig is om diensten te leveren, geschillen op te lossen, fiscale verplichtingen na te leven en rapporten te genereren.",
  cookiesInfo:
    "Functionele cookies zijn essentieel voor sessies, analytics-cookies monitoren performance en marketingcookies onthouden keuzes.",
};

const formatWebsite = (url: string) =>
  url.replace(/(^https?:\/\/)|\/$/gi, "") || "jouw website";

const generatePolicySections = (
  form: FormData,
  selectedKeys: string[]
): PolicySection[] => {
  const contactMethods = [
    form.contactEmail && `E-mail: ${form.contactEmail}`,
    form.contactPhone && `Telefoon: ${form.contactPhone}`,
  ].filter(Boolean);

  const contactSummary = contactMethods.length
    ? contactMethods.join(" • ")
    : "Contactgegevens zijn nog niet ingevuld.";

  const selectedMeta = selectedKeys
    .map((key) => dataCategories.find((category) => category.key === key))
    .filter((category): category is DataCategory => Boolean(category));

  const dataLines = selectedMeta.length
    ? selectedMeta.map(
        (category) => `${category.label} — ${category.description}`
      )
    : [
        "We verzamelen uitsluitend gegevens die jij aanlevert om de gevraagde dienst te leveren.",
      ];

  const introName = form.businessName.trim() || "Jouw bedrijf";
  const introWebsite = form.websiteUrl.trim()
    ? formatWebsite(form.websiteUrl)
    : "jouw website";
  const usageDescription = form.dataPurposes.trim()
    ? form.dataPurposes.trim()
    : "We gebruiken gegevens om functies te leveren, communicatie te personaliseren en de dienst veilig te houden volgens de AVG.";
  const thirdPartySentence = form.thirdPartyList.trim()
    ? `We werken samen met ${form.thirdPartyList.trim()} voor betalingen, analytics en berichten.`
    : "We delen gegevens enkel met derden voor de uitvoering van de gevraagde dienst.";
  const cookiesSentence = form.cookiesInfo.trim()
    ? form.cookiesInfo.trim()
    : "Cookies en soortgelijke identifiers ondersteunen essentiële functies, monitoring en personalisatie.";
  const retentionSentence = form.dataRetention.trim()
    ? form.dataRetention.trim()
    : "We bewaren gegevens slechts zolang als nodig is om de dienst te leveren, wetgeving na te leven en de veiligheid te garanderen.";

  return [
    {
      title: "Introductie & contact",
      paragraph: `${introName} exploiteert ${introWebsite}. Ingangsdatum: ${form.policyEffectiveDate}. ${contactSummary} Dit beleid volgt de AVG/GDPR en de richtlijnen van de Belgische Gegevensbeschermingsautoriteit.`,
    },
    {
      title: "Verzamelcategorieën",
      paragraph: `Bij interactie met ${introWebsite} verzamelen we volgende categorieën gegevens.`,
      list: dataLines,
    },
    {
      title: "Hoe we de gegevens gebruiken",
      paragraph: usageDescription,
    },
    {
      title: "Delen met derden",
      paragraph: thirdPartySentence,
    },
    {
      title: "Cookies & tracking",
      paragraph: cookiesSentence,
    },
    {
      title: "Bewaartermijnen",
      paragraph: retentionSentence,
    },
    {
      title: "Jouw rechten & controle",
      paragraph: `Neem contact op via ${contactSummary.toLowerCase()} om je recht op inzage, rectificatie, dataportabiliteit of wissing uit te oefenen.`,
    },
    {
      title: "Beleid bijwerken",
      paragraph:
        "We kunnen dit beleid periodiek actualiseren en publiceren steeds een nieuwe versie met de bijgewerkte datum.",
    },
  ];
};

function App() {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    dataCategories.map((category) => category.key)
  );
  const [copied, setCopied] = useState(false);

  const policySections = useMemo(
    () => generatePolicySections(formData, selectedCategories),
    [formData, selectedCategories]
  );

  const policyText = useMemo(
    () =>
      policySections
        .map((section, index) => {
          const heading = `${index + 1}. ${section.title}`;
          const body = section.paragraph ? section.paragraph.trim() : "";
          const list = section.list?.length
            ? section.list.map((line) => `- ${line}`).join("\n")
            : "";
          return [heading, body, list].filter(Boolean).join("\n");
        })
        .join("\n\n"),
    [policySections]
  );

  const handleFieldChange =
    (field: keyof FormData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((previous) => ({ ...previous, [field]: event.target.value }));
    };

  const toggleCategory = (key: string) => {
    setSelectedCategories((previous) =>
      previous.includes(key)
        ? previous.filter((item) => item !== key)
        : [...previous, key]
    );
  };

  const copyPolicy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(policyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Unable to copy policy", error);
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Op maat gemaakt privacybeleid</p>
          <h1>
            Beschrijf je site, vul de details aan en krijg een uitgewerkt beleid
          </h1>
          <p className="app-subtitle">
            Pas links de gegevens aan en kopieer rechts het voorbeeld zodra je
            een Belgisch privacybeleid nodig hebt.
          </p>
        </div>
        <div className="header-badge">
          <span>Opgebouwd met zorgvuldig gekozen defaults</span>
        </div>
      </header>

      <div className="main-grid">
        <div className="form-card">
          <div className="section-heading">
            <p className="eyebrow">1 / Gegevens</p>
            <h2>De basis</h2>
          </div>

          <div className="field-grid">
            <label>
              <span>Bedrijfsnaam of merk</span>
              <input
                type="text"
                value={formData.businessName}
                onChange={handleFieldChange("businessName")}
                placeholder="Bijv. Verzekeraar BV"
              />
            </label>
            <label>
              <span>Website URL</span>
              <input
                type="text"
                value={formData.websiteUrl}
                onChange={handleFieldChange("websiteUrl")}
                placeholder="example.be"
              />
            </label>
            <label>
              <span>Hoofdcontact e-mail</span>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={handleFieldChange("contactEmail")}
                placeholder="privacy@bedrijf.be"
              />
            </label>
            <label>
              <span>Contacttelefoon (optioneel)</span>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={handleFieldChange("contactPhone")}
                placeholder="+32 2 123 45 67"
              />
            </label>
            <label>
              <span>Ingangsdatum</span>
              <input
                type="date"
                value={formData.policyEffectiveDate}
                onChange={handleFieldChange("policyEffectiveDate")}
              />
            </label>
          </div>

          <div className="section-heading">
            <p className="eyebrow">2 / Verhaal</p>
            <h2>Context & onthullingen</h2>
          </div>

          <label>
            <span>Waarom je data verzamelt</span>
            <textarea
              rows={3}
              value={formData.dataPurposes}
              onChange={handleFieldChange("dataPurposes")}
              placeholder="Leg uit wat je met de verzamelde gegevens doet."
            />
          </label>
          <label>
            <span>Derden waarop je rekent</span>
            <textarea
              rows={3}
              value={formData.thirdPartyList}
              onChange={handleFieldChange("thirdPartyList")}
              placeholder="bv. Stripe, Google Analytics, SendGrid"
            />
          </label>
          <label>
            <span>Bewaartermijn</span>
            <textarea
              rows={3}
              value={formData.dataRetention}
              onChange={handleFieldChange("dataRetention")}
              placeholder="Hoe lang je gebruikersdata bewaart"
            />
          </label>
          <label>
            <span>Cookies & tracking</span>
            <textarea
              rows={3}
              value={formData.cookiesInfo}
              onChange={handleFieldChange("cookiesInfo")}
              placeholder="Beschrijf hoe cookies en trackers worden gebruikt"
            />
          </label>

          <div className="section-heading">
            <p className="eyebrow">3 / Categorieen</p>
            <h2>Wat je verzamelt</h2>
          </div>

          <div className="category-grid">
            {dataCategories.map((category) => {
              const active = selectedCategories.includes(category.key);
              return (
                <button
                  key={category.key}
                  type="button"
                  className={`category-chip ${
                    active ? "category-chip--active" : ""
                  }`}
                  onClick={() => toggleCategory(category.key)}
                  aria-pressed={active}
                >
                  <span>{category.label}</span>
                  <small>{category.description}</small>
                </button>
              );
            })}
          </div>
        </div>

        <div className="preview-card">
          <div className="preview-header">
            <div>
              <p className="eyebrow">2 / Voorbeeld</p>
              <h2>Gegenereerd beleid</h2>
            </div>
            <button type="button" className="copy-button" onClick={copyPolicy}>
              {copied ? "Gekopieerd" : "Kopieer beleid"}
            </button>
          </div>

          <article className="policy-preview" aria-live="polite">
            {policySections.map((section, index) => (
              <section
                className="policy-section"
                key={`${section.title}-${index}`}
              >
                <div className="policy-heading">
                  <span className="policy-step">Sectie {index + 1}</span>
                  <h3>{section.title}</h3>
                </div>
                {section.paragraph && <p>{section.paragraph}</p>}
                {section.list && (
                  <ul>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>

          <p className="preview-note">
            Valideer dit concept altijd met je juridisch team en houd het
            bijgewerkt met nieuwe functionaliteit.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
