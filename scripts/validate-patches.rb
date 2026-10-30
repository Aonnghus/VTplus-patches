#!/usr/bin/env ruby
# Validates _data/patches.csv so a bad edit fails CI instead of breaking the site.
# Usage: ruby scripts/validate-patches.rb [path/to/patches.csv]

require "csv"

path = ARGV[0] || File.expand_path("../_data/patches.csv", __dir__)

HEADERS = [
  "Name", "Author", "Description", "Inspired by", "Music style", "Created on",
  "Demo", "# votes", "Rating", "Amp style", "Tap", "PowerLevel", "Edit2",
  "Edit3", "Volume", "Treble", "Middle", "Bass", "Effect2", "Master", "Gain",
  "Edit1", "Effect1", "Red-Green", "Edit2Hold", "TapOnOff", "AmpPower",
  "Original order"
].freeze

# Amp settings read by assets/js/script.js, with their allowed ranges.
# A patch either has all of them or none (some patches were recovered without settings).
SETTINGS = {
  "Amp style" => 1..11, "Effect1" => 1..11, "Effect2" => 1..11,
  "Red-Green" => 1..3, "TapOnOff" => 0..1, "Tap" => 0..10_000,
  "PowerLevel" => 0..100, "Gain" => 0..100, "Volume" => 0..100,
  "Treble" => 0..100, "Middle" => 0..100, "Bass" => 0..100,
  "Master" => 0..100, "Edit1" => 0..100, "Edit2" => 0..100,
  "Edit3" => 0..100, "Edit2Hold" => 0..100
}.freeze

AMP_POWERS = [20, 40, 80, 120].freeze

def integer?(value)
  !value.nil? && value.strip.match?(/\A\d+\z/)
end

def blank?(value)
  value.nil? || value.strip.empty?
end

begin
  rows = CSV.read(path, headers: true)
rescue CSV::MalformedCSVError => e
  abort "#{path}: malformed CSV: #{e.message}"
end

# Row checks look up columns by name, so a bad header would only add noise.
if rows.headers != HEADERS
  missing = HEADERS - rows.headers
  extra = rows.headers - HEADERS
  abort "#{path}: header mismatch (missing: #{missing.inspect}, unexpected: #{extra.inspect}, " \
        "or columns out of order)"
end

errors = []
errors << "no patches found" if rows.empty?

seen_order = {}

rows.each_with_index do |row, index|
  label = "patch #{index} (#{row["Name"].to_s.strip.inspect})"

  errors << "#{label}: Name is blank" if blank?(row["Name"])

  power = row["AmpPower"]
  unless integer?(power) && AMP_POWERS.include?(power.to_i)
    errors << "#{label}: AmpPower #{power.inspect} must be one of #{AMP_POWERS.join(", ")}"
  end

  order = row["Original order"]
  if !integer?(order)
    errors << "#{label}: Original order #{order.inspect} is not an integer"
  elsif seen_order.key?(order.to_i)
    errors << "#{label}: Original order #{order} duplicates patch #{seen_order[order.to_i]}"
  else
    seen_order[order.to_i] = index
  end

  blank_settings = SETTINGS.keys.select { |column| blank?(row[column]) }
  next if blank_settings.size == SETTINGS.size

  unless blank_settings.empty?
    errors << "#{label}: settings partially filled, blank: #{blank_settings.join(", ")}"
  end

  SETTINGS.each do |column, range|
    value = row[column]
    next if blank?(value)

    unless integer?(value) && range.cover?(value.to_i)
      errors << "#{label}: #{column} #{value.inspect} must be an integer in #{range}"
    end
  end
end

if errors.empty?
  puts "#{path}: #{rows.size} patches OK"
else
  warn errors.map { |error| "#{path}: #{error}" }
  abort "#{errors.size} error(s) found"
end
